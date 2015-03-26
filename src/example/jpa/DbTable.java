package example.jpa;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "tablelist")
/*
 * define O-R mapping of tablelist table
 */
public class DbTable {
	@Id //primary key
	@Column(name = "TABNAME")
	@GeneratedValue(strategy = GenerationType.AUTO)
	String name;
	
	@Basic
	@Column(name = "TABSCHEMA")
	@GeneratedValue(strategy = GenerationType.AUTO)
	String schema;
	
	public String getSchema() {
		return schema;
	}

	public void setSchema(String schema) {
		this.schema = schema;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return String.format("{\"schema\": \"%s\", \"name\": \"%s\"}", schema, name);
	}
}
