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

