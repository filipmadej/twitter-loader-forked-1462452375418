package example.jpa;

import java.util.List;

import javax.naming.Binding;
import javax.naming.InitialContext;
import javax.naming.NameClassPair;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.persistence.EntityManager;
import javax.transaction.UserTransaction;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/tablelist")
/**
 * CRUD service of list tables. It uses REST style.
 *
 */
public class DbTableListResource {

	private UserTransaction utx;
	private EntityManager em;
	private String allnames;

	public DbTableListResource() {
		utx = getUserTransaction();
		em = getEm();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response get() {
		return Response.ok("em=" + em + "\n" + allnames).build();
//		List<DbTable> list = em.createQuery("select TABSCHEMA, TABNAME from SYSCAT.TABLES where TABSCHEMA=CURRENT_SCHEMA", DbTable.class).getResultList();
//		//TODO use JSON util like Gson to render objects and use REST Response Writer
//		String json = "{\"id\":\"all\", \"body\":" + list.toString() + "}";
//		return Response.ok(json).build();
	}
	
	
	private UserTransaction getUserTransaction() {
		InitialContext ic;
		try {
			ic = new InitialContext();
			return (UserTransaction) ic.lookup("java:comp/UserTransaction");
		} catch (NamingException e) {
			e.printStackTrace();
		}
		return null;
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

	private EntityManager getEm() {
		InitialContext ic;
		NamingEnumeration<NameClassPair> en;
		NamingEnumeration<Binding> eb;
		NameClassPair pair;
		Binding bd;
		try {
			ic = new InitialContext();
			en = ic.list("");
			allnames="List:\n";
			while (en.hasMore() ) {
				pair = en.next();
				allnames = allnames + "\t" + pair.getName() + ":" + pair.getClassName() + "\n";
			}
			eb = ic.listBindings("");
			allnames= allnames + "ListBindings:\n";
			while (eb.hasMore() ) {
				bd = eb.next();
				allnames = allnames + "\t" + bd.toString() + "\n";
			}
			return (EntityManager) ic.lookup("java:comp/env/jdbc/mydbdatasource");
		} catch (NamingException e) {
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

}
