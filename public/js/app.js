// clien-side validation (bootstrap)

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()


// slider
let slides=document.querySelectorAll(".slide");
let next=document.querySelector(".next");
let prev=document.querySelector(".prev");
let counter=0;
let slideImage=()=>{
    slides.forEach((slide)=>{
         slide.style.transform=`translateX(-${counter*100}%)`;
    });
}
next.addEventListener("click",function (event) {
     counter=counter+1===slides.length?0:counter+1;
     event.stopPropagation();
     slideImage();
  });
prev.addEventListener("click",function(event){
    counter=counter-1<0?slides.length-1:counter-1;
    event.stopPropagation();
    slideImage();
});
let autoClick=()=>{
    next.click();
}
setInterval(autoClick,3000);

