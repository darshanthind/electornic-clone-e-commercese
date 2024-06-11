$(document).ready(function() {
    $('#myFormlogin').submit(function(e) {
      e.preventDefault(); 
      return login();
      
    });
    $('#myFormsignup').submit(function(e) {
      e.preventDefault(); 
      return signup();
      
    });
    $("#login_window").click(function(){
      $(".close").trigger('click');
    })
    $("#forget").click(function(){
      $(".close").trigger('click');
    })
  });
 
  async function login(){
    let name=document.getElementById("EmailL").value;
    let g=document.getElementById("passwordL").value;
    let mess=document.getElementById("messageL");
    console.log("hello,world");
      try{
      const r=await fetch("/userColloection")
      if(!r.ok){
        throw new Error('Failed to fetch data');
      }
      const d=await r.json();
      for(let i of d){
        if(i.Email==name && i.Password==g && i.isActive==true){
          console.log(i.Username,i.Password);
          let body={
           Email:name,
           Password:g,
           ids:i.ids,
           Username:i.Username

            
    }
    let response= await fetch("/Login_id",{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      method:'post',
      body:JSON.stringify(body)
       
      })
      // const result = await response.json();
  // console.log('Success:', result);
           
      location.reload();
        return true;
        } else if(i.Email==name && i.Password==g && isActive==false){
            mess.innerText="Please verfiy your account";
            return false
        }
      }

      mess.innerText="Incorrect email and password";
     
      return false;
      }catch(error){
        console.error('Error fetching data:', error);
        return false;
      }
    }
    async function signup(){
      console.log("helloword");
      let Username=document.getElementById("Username").value;
      let Email=document.getElementById("Email").value;
      let Password=document.getElementById("Password").value;
      let CPassword=document.getElementById("Cpassword").value;
      let mess=document.getElementById("message");
      if(Password!==CPassword){
        mess.innerText="Password and CPassword not Match";
        return false;
      }
      // console.log("hello,world");
        try{
        const r=await fetch("/userColloection")
        if(!r.ok){
          throw new Error('Failed to fetch data');
        }
        const d=await r.json();
        for(let i of d){
          if(i.Email==Email){
            mess.innerText="Email is all ready User";
            return false;
    
          }
            
              
       }

       let body={
          Username:Username,
          Email:Email,
          Password:Password
       }
         let response= await fetch("/user_stores",{
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method:'post',
        body:JSON.stringify(body)
         
        })
        if (!response.ok) {
          throw new Error('Failed to fetch data');
      }
        const result = await response.json();
        window.location.href = result.redirectUrl;
    // console.log('Success:', result);
   console.log("reloade");
  //  location.reload();
   return true;
      }catch(error){
          console.error('Error fetching data:', error);
          return false;
        }
      }