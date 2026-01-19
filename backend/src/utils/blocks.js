export function chunkBlockRange(fromBlock, toBlock, chunkSize = 10) {
  const ranges = [];

  let start = fromBlock;
  while (start <= toBlock) {
    const end = Math.min(start + chunkSize - 1, toBlock);
    ranges.push([start, end]); //ranges stored, queries  (chunksize-1) more blocks after toBlock . e.g - fromBlock=18000000&toBlock=18000100 then last range = [180000100,18000109]
    start = end + 1;
  }

  return ranges;
}
