// Prime Number Checking

let number;
const primeCheck = (number) => {
	if(number < 2) return false;

	for (let i = 2; i < number; i++) {
		if (number % i === 0) {
			return false;
		}
	}
		return true;
}

test("check number", () => {
	expect(primeCheck(3)).toEqual(true);
});

// Vowels Check

let alphabet = '';
function vowelsCheck(alphabet) {
	let alphabetUppercase = alphabet.toUpperCase();
	let isVocal = alphabetUppercase  == "A"
					|| alphabetUppercase == "E"
					|| alphabetUppercase == "I"
					|| alphabetUppercase == "O"
					|| alphabetUppercase == "U" ? true : false;
	return isVocal;
}

test("check vowels ", () => {
	expect(vowelsCheck('I')).toEqual(true);
});

// Ganjil Genap

let num;
const numberCheck = (num) => {
	if(num % 2 === 0){
		return true;
	} else {
		return false;
	}
}

test("check number", () => {
	expect(numberCheck(2)).toEqual(true);
});
