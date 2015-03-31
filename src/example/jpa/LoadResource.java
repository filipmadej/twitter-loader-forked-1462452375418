package example.jpa;

import java.io.InputStreamReader;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;
import java.util.List;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.ibm.nosql.json.api.BasicDBList;
import com.ibm.nosql.json.api.BasicDBObject;
import com.ibm.nosql.json.util.JSON;


@Path("/load")
/**
 * CRUD service to load tweets into a table. It uses REST style.
 *
 */
public class LoadResource {

	private Connection con;
	private String searchURL;
	private String credentials;
	private String status;
	private String phase;
	private int numtweets;
	private int maxtweets;

	public LoadResource() {
		status = "idle";
		phase = "Not started...";
		numtweets = 0;
		maxtweets = 0;
		con = getConnection();
		retrieveURL();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public Response create(@FormParam("q") String query, @FormParam("table") String tablename, @FormParam("columns") String columns) {
		Statement stmt;
		String retstr = "";
		int numtbls = 0;
		
		// first check initialization errors
		if (searchURL == null || credentials == null) {
			retstr = "{\"status\":\"error\", \"phase\":\"REST API not configured correctly...\"}";
			return Response.ok(retstr).build();
		} else if (status != "idle") {
			retstr = "{\"status\":\"error\", \"phase\":\"REST API already in used...\"}";			
			return Response.ok(retstr).build();
		}
		
		// create the table as indicated
		try {
			status = "running";
			phase = "Creating table " + tablename + "...";
			stmt = con.createStatement();
			stmt.executeUpdate(getCreateStatement(tablename, columns));
		} catch (SQLException e) {
			e.printStackTrace();
			status = "error";
			phase = "Could not create table " + tablename + ": " + e.toString().replaceAll("\"", "\'");
			retstr = "{\"status\":\"" + status + "\", \"phase\":\"" + phase + "\"}";
			return Response.ok(retstr).build();
		}
		
		// load the tweets into the table
		phase = "Loading " + maxtweets + " into table " + tablename + "...";
		
		status = "loaded";
		phase = "Table " + tablename + "created and " + maxtweets + " tweets loaded successfully.";
		retstr = "{\"status\":\"" + status + "\", \"phase\":\"" + phase + "\"}";
		
		return Response.ok(retstr).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response get() {
		String retstr = "";
		if (searchURL == null || credentials == null) {
			retstr = "{\"status\":\"error\", \"phase\":\"REST API not configured correctly...\"}";
			return Response.ok(retstr).build();
		}
		retstr = "{\"status\":\"" + status + "\", \"phase\":\"" + phase + "\", \"actual\":" + numtweets + ", \"expected\":" + maxtweets + "}";
		if (status == "error" || status == "loaded") {
			status="idle";
			phase="Not started...";
			numtweets = 0;
			maxtweets = 0;
		}
		return Response.ok(retstr).build();
	}
	
	
	// There are two ways of obtaining the connection information for some services in Java 
	
	// Method 1: Auto-configuration and JNDI
	// The Liberty buildpack automatically generates server.xml configuration 
	// stanzas for the SQL Database service which contain the credentials needed to 
	// connect to the service. The buildpack generates a JNDI name following  
	// the convention of "jdbc/<service_name>" where the <service_name> is the 
	// name of the bound service. 
	// Below we'll do a JNDI lookup for the EntityManager whose persistence 
	// context is defined in web.xml. It references a persistence unit defined 
	// in persistence.xml. In these XML files you'll see the "jdbc/<service name>"
	// JNDI name used.

	private Connection getConnection() {
		InitialContext ic;
		try {
			ic = new InitialContext();
			return (Connection) ((DataSource) ic.lookup("java:comp/env/jdbc/mydbdatasource")).getConnection();
		} catch (NamingException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

	// Method 2: Parsing VCAP_SERVICES environment variable
    // The VCAP_SERVICES environment variable contains all the credentials of 
	// services bound to this application. You can parse it to obtain the information 
	// needed to connect to the SQL Database service. SQL Database is a service
	// that the Liberty buildpack auto-configures as described above, so parsing
	// VCAP_SERVICES is not a best practice.
	
	// see HelloResource.getInformation() for an example


	private void retrieveURL() {
		String envServices = System.getenv("VCAP_SERVICES");
        if (envServices == null) { searchURL = null; credentials = null; return; }
        BasicDBObject obj = (BasicDBObject) JSON.parse (envServices);
        String thekey = null;
        Set<String> keys = obj.keySet();
        System.out.println ("Searching through VCAP keys");
  	  // Look for the VCAP key that holds the SQLDB information
        for (String eachkey : keys) {
      	  if (eachkey.contains("twitterinsights")) {
      		  thekey = eachkey;
      	  }
        }
        if (thekey == null) { searchURL = null; credentials = null; return; }        
        BasicDBList list = (BasicDBList) obj.get (thekey);
        obj = (BasicDBObject) list.get ("0");
        obj = (BasicDBObject) obj.get ("credentials");
        searchURL = "https://" + (String) obj.get("host") + "/api/v1/messages/search";
        String creds = (String) obj.get("username");
        creds += ":" + (String) obj.get("password");
		credentials = javax.xml.bind.DatatypeConverter.printBase64Binary(credentials.getBytes());
	}


	private String getCreateStatement(String tablename, String columns) {
		String create="CREATE TABLE \"" + tablename + "\"(";
		String[] coldefs = columns.split("\\|");
		for (int i=0; i<coldefs.length; i = i + 3) {
			create += "\"" + coldefs[i] + "\" " + coldefs[i+1] + ",";
		}
		return create.substring(0, create.length()-1) + ")";
	}

}
