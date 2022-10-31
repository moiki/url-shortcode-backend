## Url Shortcode Generator - API
_____________________________
*default User*
```Javascript
    email: "default@user.com",
    password: "pa$$w0rd"
```
graphql Queries

List of Urls
```graphql
query($page: Int! $perPage: Int! ){
   ListUrls(page: $page perPage: $perPage) {
       docs {
           original_url
           short_url
           visits_quantity
       }
       total
   }    
}
```

Login
```graphql
 query ($email: String! $password: String!){
    Login(email: $email password: $password) {
        token,
        username
    }
}
}
```

Visit the shortcode Url

`GET http://localhost:5000/:code`