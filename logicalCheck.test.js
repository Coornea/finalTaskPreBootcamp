// Prime Number Checking

const number = [];
const primeCheck = (number) => {
	let pembagi = 0;
	for (let i = 1; i <= number; i++) {
		if (number % i === 0) {
			pembagi++;
		}
	}
	if (pembagi === 2) {
		return 1;
	} else {
		return 0;
	}
};
test("check number ", () => {
	expect(primeCheck(2)).toBe(number === 1);
});

// Kind of Age

const umur = [67, 23, 12, 3, 89, 54];

const golongan = umur.map((check) => {
   return 
})