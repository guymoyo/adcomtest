package org.adorsys.adbase.rest;

import java.util.Date;

import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;



@Stateless
@Path("/ping")
public class PingEndpoing {
    @GET
    @Produces("application/json")
    public String ping() {
        return"this is ADBASE app reply server "+new Date();
    }
}
