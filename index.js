function emailToggle(){
    document.querySelector('.rrect#emailr').classList.toggle('nrrect')
    return false
}
const delay = ms => new Promise(res => setTimeout(res, ms));
var flag2=false
async function msgToggle(){
    a=document.querySelector('.hrrect#messager')
    flag=a.classList.contains("hnrrect")
    a.classList.toggle('hnrrect')
    flag2=document.getElementById('col1').scrollTop === 0
    console.log(a.scrollTop)
    if (flag){
        for(i=0;i<20;i++){
            await delay(20)
            if (i===10 || flag2){
                a.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }
    return false
}
const textareas = document.querySelectorAll('textarea');

textareas.forEach(textarea => {
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
});
const APIURL=window.location.hostname === "localhost"?"http://localhost:9051":"https://8051.proxy.tanjim.org/"
const msgstate=document.getElementById("msgstate")
const msginput=document.getElementById("msginput")
const priority=document.getElementById("priority")
async function sendMsg(){
    if(msginput.value===""){
        msgstate.innerText="write a non-empty message!"
        return
    }
    msgstate.innerText="sending..."
    try {
        response = await fetch(APIURL+"/sendmsg", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"message":msginput.value,"priority":priority.checked})
        });
        if (response.status===429){
            msgstate.innerText="you are sending too many messages. try again later."
            return
        }
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error(error.message);
        msgstate.innerText="an error occured."
        return
    }
    msgstate.innerText="success!"

}

