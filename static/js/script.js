const form=document.getElementById("predictionForm");
const button=document.querySelector(".predict-btn");

const resultCard=document.getElementById("resultCard");

const cropName=document.getElementById("cropName");

const cropImage=document.getElementById("cropImage");

const season=document.getElementById("season");
const soil=document.getElementById("soil");
const water=document.getElementById("water");


const cropInfo={

rice:{
season:"Kharif",
soil:"Clay Loam",
water:"High",
image:"/static/images/rice.png"
},

maize:{
season:"Kharif",
soil:"Loamy",
water:"Medium",
image:"/static/images/maize.png"
},

cotton:{
season:"Kharif",
soil:"Black Soil",
water:"Medium",
image:"/static/images/cotton.png"
},

coffee:{
season:"Spring",
soil:"Well Drained",
water:"Medium",
image:"/static/images/coffee.png"
}

};

form.addEventListener("submit",async(e)=>{

e.preventDefault();

let valid=true;

document.querySelectorAll("input").forEach(input=>{

input.classList.remove("invalid");

if(input.value===""){

valid=false;

input.classList.add("invalid");

}

});

if(!valid){

alert("Please fill all fields.");

return;

}

button.disabled=true;

button.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Predicting...';

const data={

N:N.value,
P:P.value,
K:K.value,
temperature:temperature.value,
humidity:humidity.value,
ph:ph.value,
rainfall:rainfall.value

};

try{

const response=await fetch("/predict",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(data)

});

const result=await response.json();

if(result.success){

const crop=result.crop.toLowerCase();

cropName.textContent=result.crop;

if(cropInfo[crop]){

cropImage.src=cropInfo[crop].image;

season.textContent=cropInfo[crop].season;

soil.textContent=cropInfo[crop].soil;

water.textContent=cropInfo[crop].water;

}

resultCard.classList.remove("hidden");

resultCard.scrollIntoView({

behavior:"smooth"

});

}else{

alert(result.error);

}

}catch{

alert("Prediction Failed");

}

button.disabled=false;

button.innerHTML='<i class="fa-solid fa-wand-magic-sparkles"></i> Predict Crop';

});