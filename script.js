const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

//set strength circle color to grey
setIndicator("#ccc");


//set passwordLength
function handleSlider() {

    // handleslider ka kam password length ko UI pr intreface krana 


    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    //or kuch bhi karna chahiye ? - HW ----->>>>>

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"
}

// iska kam keval jo apka indicator h uske color ko set krna h


function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// getrndinteger (min,max) kleval apko mon aur max ke bicha ka range find out krke de rha h

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;

    // Math.random() hme 0 -1 ke bich ki koi random num deta h  aur hm mul iskiye kiye taki hm min se max ke bich int value nikal paye
    // Math.floor use float ko roundofff krne ke liye hota  h
}

function generateRandomNumber() {
    return getRndInteger(0, 9);

    // ye 0-9 ke bich koi bhi no utha lega

}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123))

    // 97 a aur 123 z ki ascii value hoti h
    // String.fromCharCode hme no se char me bdlta h 
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

//  ye ham apne se condition bnae h calcstrength 

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    // dot chehcked proprty hm use krte h dekhne ke liye ki ye tick h ki nh agr tik h to true aurr nh to nh

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

// ye copy ke liye h mtlb jb hm copy wala btn dabate h to ye 

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);

        // navigator.clipboard.writeText  -> ye method text copy krne ke liye hota h

        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
        // to make copy wala span visible

    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

    //  hm set timeout isliye use kiye kyuki jb hm copy wala btn click krte h to copied likhhr kuch sec bad gayb ho jata h 
    // to hm set timeout se hm us property ko us time ke bad remove kr denge

}
// shuffle  ka fucntion likhenge hm 

function shufflePassword(array) {
    // ---->>>>   fisher yates method --->>>> ye ek algorithm hoti h 

    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    //special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// ab hm generate pass wala dekhenge jo age piche krne se bdlta h

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if (checkCount == 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    // --->>>   ham dusre se try kr rhr h


    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if (lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});