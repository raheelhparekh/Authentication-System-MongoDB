class ApiClient {
  constructor() {
    this.baseURL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
  }

  // custom fetch method
  async customFetchMethod(endpoint,options={}){
    try {
        const url=`${this.baseURL}${endpoint}`;
        const headers={...this.defaultHeaders,...options.headers}

        const config={
            ...options,
            headers,
            credentials:"include" // required for cookies
        }

        console.log(`Fetching Url : ${url}`)
        const response= await fetch(url,config)
        const data=await response.json()
        return data;
        
    } catch (error) {
        console.error(" error occured", error)
        throw error
        
    }
  }

  // Auth Endpoints
  async signup(name,email,password){
    return this.customFetchMethod("/users/register",{
        method:"POST",

        // JSON.stringify converts json->string 
        // "name": "", "email": "", "password":""
        
        body:JSON.stringify({name,email,password})
    })
  }

  async login(email,password){
    return this.customFetchMethod("/users/login",{
        method:"POST",
        body:JSON.stringify({email,password})
    })
  }

  async getProfile(){
    return this.customFetchMethod("/users/me",{
        method:"GET"
    })
  }

  async forgotPassword(email){
    return this.customFetchMethod("/users/forgot-password",{
      method:"POST",
      body:JSON.stringify({email})
    })
  }

  async logout() {
    return this.customFetchMethod("/users/logout", {
      method: "GET"
    });
  }

  async resetPassword(token,password){
    return this.customFetchMethod(`/users/reset-password/${token}`,{
      method:"POST",
      body:JSON.stringify({password})
    })
  }

  async verifyEmail(token){
    return this.customFetchMethod(`/users/verify/${token}`,{
      method:"GET"
    })
  }
}

const apiClient=new ApiClient

export default apiClient