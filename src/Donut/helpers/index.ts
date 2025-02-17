export const redistribute = (
  nums: number[],
  index: number,
  diff: number,
  minValue = 10,
): number[] => {
  const newNums = [...nums];

  newNums[index] += diff;

  let remain = newNums.reduce((acc, val) => acc + val, 0) - 100;
  let decrease = remain / (newNums.length - 1);

  const maxIterations = 100;
  let iteration = 0;
  const d = 1e-10;

  if (diff > 0) {
    while (remain > d) {
      for (let i = 0; i < newNums.length && remain > 0; i++) {
        if (i !== index && newNums[i] > minValue) {
          const actualDecrease = Math.min(
            decrease,
            newNums[i] - minValue,
            remain,
          );

          newNums[i] -= actualDecrease;
          remain -= actualDecrease;
        }
      }
      decrease =
        remain /
        newNums.filter((val, idx) => idx !== index && val > minValue).length;
      iteration = iteration + 1;

      if (iteration > maxIterations) {
        throw new Error('Bad data');
      }
    }
  } else {
    while (remain < -d) {
      for (let i = 0; i < newNums.length && remain < 0; i++) {
        if (i !== index) {
          const actualIncrease = Math.min(
            Math.abs(decrease),
            100 - newNums[i],
            Math.abs(remain),
          );

          newNums[i] += actualIncrease;
          remain += actualIncrease;
        }
      }
      decrease =
        remain /
        newNums.filter((val, idx) => idx !== index && val < 100).length;

      iteration = iteration + 1;

      if (iteration > maxIterations) {
        throw new Error('Bad data');
      }
    }
  }

  return newNums;
};

export const roundAndAdjust = (nums: number[], index: number): number[] => {
  const roundedNums = nums.map(Math.round);
  const sum = roundedNums.reduce((a, b) => a + b, 0);

  const diff = 100 - sum;

  roundedNums[index] += diff;

  return roundedNums;
};
