# ensyclopedia-group-project

## WikwikPedia


| Endpoints | Methods | Param                     | Output (Success)                                                     | Output (Error)                   |
|-----------|---------|---------------------------|----------------------------------------------------------------------|----------------------------------|
| /signup   | POST    | body: { email, password } | 200 {user}                                                           | 500 {error}                      |
| /signin   | POST    | body:{email,password}     | 200  { message: 'You have successfully logged in!', token, details } | 500 {error}                      |
| /gSignIn  | POST    | body: {token}             | 200 { token }                                                        | 500 {error}                      |
| /analyze  | POST    | body: {text}              | 200 [entities]                                                       | 500 'Error during text analysis' |
| /youtube  | GET     | headers: {keyword}        | 200 data                                                             | 500 {error}                      |