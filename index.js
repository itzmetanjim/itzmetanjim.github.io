
window.setTimeout(()=>{document.body.classList.toggle('dark')
    document.body.classList.toggle('small')
},100)
window.addEventListener('keydown',(e)=>{
    if(e.key === 'p'){
        document.body.classList.toggle('dark')
    }
})
