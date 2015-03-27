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


@Path("/load")
/**
 * CRUD service to load tweets into a table. It uses REST style.
 *
 */
public class LoadResource {

	private Connection con;
	private String phase;
	private int numtweets;
	private int maxtweets;

	public LoadResource() {
		con = getConnection();
		phase = "Not started...";
		numtweets = 0;
		maxtweets = 0;
	}

	@POST
	public Response create(@QueryParam("q") String query, @QueryParam("table") String tablename, @FormParam("columns") String columns) {
		String json = "{\"table\":";
		// create the table as indicated
		Statement stmt;
		int numtbls = 0;
		try {
			stmt = con.createStatement();
			stmt.executeUpdate(getCreateStatement(tablename, columns));
			json += "\"created\"}";
		} catch (SQLException e) {
			e.printStackTrace();
			json +="\"not created\", \"error\": \"" + e.toString() + "\"}";
			return Response.ok(json).build();
		}
		
		// load the tweets into the table
		
		
		return Response.ok(json).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response get() {
		String status = "{\"phase\":\"" + phase + "\", \"actual\":" + numtweets + ", \"expected\":" + maxtweets + "}";
		return Response.ok(status).build();
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

	private String getCreateStatement(String tablename, String columns) {
		String create="CREATE TABLE \"" + tablename + "\"(";
		String[] coldefs = columns.split(",");
		for (int i=0; i<coldefs.length; i++) {
			String[] colparts = coldefs[i].split("");
			create += "\"" + colparts[0] + "\" " + colparts[1] + ",";
		}
		return create.substring(0, create.length()-1) + ")";
	}

}
