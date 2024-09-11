var fname = document.querySelector("#first-name")
var fnerror = document.querySelector("#fn-error")
var lname = document.querySelector("#last-name")
var lnerror = document.querySelector("#ln-error")
var email = document.querySelector("#email")
var emailerror = document.querySelector("#email-error")
var confirm = document.querySelector("#email-confirm")
var confirmerror = document.querySelector("#confirm-error")
var phone = document.querySelector("#phone")
var phoneerror = document.querySelector("#phone-error")

var submit = document.querySelector(`input[type="button"]`)
var fvalidate= /^[a-zA-Z\-]+$/
var evalidate= /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/
var pvalidate= /^(\+?\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/

submit.addEventListener(`click`,(e)=>{

    let correct = 0

    if (fvalidate.test(fname.value)===false)
    {
        fnerror.style.color=`red`
        fnerror.innerHTML=`Must be a first name.`
        console.log("error")
    }
    else{
        fnerror.style.color=`black`
        fnerror.innerHTML=``
        console.log("passed")
        correct += 1


    }

    if (fvalidate.test(lname.value)===false)
        {
            lnerror.style.color=`red`
            lnerror.innerHTML=`Must be a last name.`
        }
        else{
            lnerror.style.color=`black`
            lnerror.innerHTML=``
            correct += 1
    
        }

    if (evalidate.test(email.value)===false)
        {
            emailerror.style.color=`red`
            emailerror.innerHTML=`Must be a valid email.`
            console.log("invalid email")

        }
        else{
            emailerror.style.color=`black`
            emailerror.innerHTML=``
            console.log("correct email")
            correct += 1


        }

    if (confirm.value===email.value){
        confirmerror.innerHTML=``
        console.log("correct")
        correct += 1
    }
    else{
        confirmerror.style.color=`red`
        confirmerror.innerHTML=`Email address must match.`
        console.log("incorrect")
    }
    if (pvalidate.test(phone.value)===false)
        {
        phoneerror.style.color=`red`
        phoneerror.innerHTML=`Must be a valid phone number.`
        console.log("correct phone")
        }
    else{
        phoneerror.innerHTML=``
        console.log("correct phone")
        correct += 1
    }

    console.log(correct)

    if (correct === 5){
        var person = {
            fname:fname.value,
            lname:lname.value,
            email:email.value,
            phone:phone.value
           }
           document.querySelector("#form").style.display = `none`
           document.querySelector("#confirmation").style.display = `block`
           document.querySelector("#info").innerText = `${person.fname} ${person.lname} \n ${person.email} \n ${person.phone}`
    }
    

})
console.log(submit)
