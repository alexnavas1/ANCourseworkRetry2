package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.UUID;

@Path("Users/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Users{
    @GET
    @Path("list")
    public String UsersList() {
        System.out.println("Invoked Users.UsersList()");
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT UserID, Username, Password, FirstName, LastName, Admin FROM Users");
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject();
                row.put("UserID", results.getInt(1));
                row.put("Username", results.getString(2));
                row.put("Password", results.getString(3));
                row.put("FirstName", results.getString(4));
                row.put("LastName", results.getString(5));
                row.put("Admin", results.getBoolean(6));
                response.add(row);
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

    @POST
    @Path("create")
    public String UsersCreate(@FormDataParam("Username") String Username, @FormDataParam("Password") String Password, @FormDataParam("FirstName") String FirstName, @FormDataParam("LastName") String LastName, @FormDataParam("AdminKey") String AdminKey) {
        try {
            System.out.println("Invoked Users.UserCreate Username=" + Username);
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Users (Username, Password, FirstName, LastName, AdminKey) VALUES (?, ?, ?, ?, ?)");
            ps.setString(1, Username);
            ps.setString(2, Password);
            ps.setString(3, FirstName);
            ps.setString(4, LastName);
            ps.setString(5, AdminKey);
            ps.execute();
            return "{\"OK\": \"User created\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create user, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("login")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String UsersLogin(@FormDataParam("Username") String Username, @FormDataParam("Password") String Password) { //defines the variables to be handed to the API method which will be used throughout the process
        System.out.println("Invoked loginUser() on path users/login");
        try {
            PreparedStatement ps1 = Main.db.prepareStatement("SELECT Password FROM Users WHERE Username = ?");
            ps1.setString(1, Username);
            ResultSet loginResults = ps1.executeQuery(); //in this line and the 2 above, the database gets the password already in the database which matches the provided username, ready to be compared with the user's inputted password
            if (loginResults.next() == true) {
                String correctPassword = loginResults.getString(1);
                if (Password.equals(correctPassword)) {
                    String Token = UUID.randomUUID().toString(); //this line generates a token to be used as the cookies during the user's visit to the site
                    PreparedStatement ps2 = Main.db.prepareStatement("UPDATE Users SET Token = ? WHERE Username = ?");
                    ps2.setString(1, Token);
                    ps2.setString(2, Username);
                    ps2.executeUpdate(); //this line and the 3 above are about sending the user's cookies to the database, so that they are remembered for later
                    JSONObject userDetails = new JSONObject();
                    userDetails.put("Username", Username);
                    userDetails.put("Token", Token); // this includes the token to be used for the current user
                    return userDetails.toString();
                } else {
                    return "{\"Error\": \"Incorrect password!\"}"; //this links to line 72 ( if (Password.equals(correctPassword)), and it means that if the provided password doesn't match the one in the database, the password is incorrect
                }
            } else {
                return "{\"Error\": \"Incorrect username.\"}"; //this is the else statement linking to line 70 (if loginresults.next ==true), and it means that if a corresponding password isn't found then it must be because the username given is wrong
            }
        } catch (Exception exception) {
            System.out.println("Database error during /users/login: " + exception.getMessage());
            return "{\"Error\": \"Server side error!\"}"; //these last two lines define how to react if none of the above code runs successfully, giving a non-specific error message
        }
    }

    //returns the userID with the token value
    public static int validToken(String Token) {
        System.out.println("Invoked User.validateToken(), Token value " + Token);
        try {
            PreparedStatement statement = Main.db.prepareStatement("SELECT UserID FROM Users WHERE Token = ?");
            statement.setString(1, Token);
            ResultSet resultSet = statement.executeQuery();
            System.out.println("userID is " + resultSet.getInt("UserID"));
            return resultSet.getInt("UserID");  //Retrieve by column name  (should really test we only get one result back!)
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return -1;  //rogue value indicating error
        }
    }

    @POST
    @Path("getProgress")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String getProgress(@CookieParam("Token") String Token) {
        System.out.println("Invoked Users.getProgress() with Token " + Token);
        try {
            // finds the user record based on the Token passed after logging in
            PreparedStatement ps = Main.db.prepareStatement("SELECT Health, Stamina, Score, ProgressID FROM Users WHERE Token = ?");
            ps.setString(1, Token);
            ResultSet results = ps.executeQuery();
            JSONObject response = new JSONObject();
            if (results.next()) { // if the user exists with the same token
                response.put("Health", results.getInt(1));
                response.put("Stamina", results.getInt(2));
                response.put("Score", results.getInt(3));

                // gets the background ID based on the ProgressID in the Stage table
                PreparedStatement ps2 = Main.db.prepareStatement("SELECT BackgroundID FROM Stage WHERE ProgressID = ?");
                ps2.setInt(1,results.getInt(4));
                ResultSet rs2 = ps2.executeQuery();
                if(rs2.next()){ // if the backgroundID exists
                    PreparedStatement ps3 = Main.db.prepareStatement("SELECT BackgroundImage FROM Backgrounds WHERE BackgroundID = ?");
                    ps3.setInt(1,rs2.getInt(1));
                    ResultSet rs3 = ps3.executeQuery();
                    if(rs3.next()){
                        response.put("BackgroundImage",rs3.getString(1)); // add the name of the image to the JSON string
                    }else{
                        return "{\"Error\": \"Unable to find an image matching the background ID.\"}";
                    }
                }else{
                    return "{\"Error\": \"Unable to find a matching progress ID.\"}";
                }
                response.put("ProgressID", results.getInt(4));
            }
            return response.toString();

            /* alternative code for multiple items being read from a table
                JSONArray jsa = new JSONArray();
                JSONObject jso = new JSONObject();
                while(results.next()){
                    response.put("Health", results.getInt(1));
                    response.put("Stamina", results.getInt(2));
                    response.put("Score", results.getInt(3));
                    response.put("ProgressID", results.getInt(4));
                    jsa.add(response);
                }
                jso.put("stats", jsa);
                return jso.toString();
             */

        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to get item, please see server console for more info.\"}";
        }
    }
}


