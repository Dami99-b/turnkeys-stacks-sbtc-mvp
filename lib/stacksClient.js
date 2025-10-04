export const EXPLORER = (txid) => `https://explorer.testnet.stacks.co/txid/${txid}`;
export const makeFakeTxId = () => {
  const rnd = () => Math.floor(Math.random()*0xffffffff).toString(16).padStart(8,'0');
  return '0x' + (rnd()+rnd()+rnd()+rnd());
};
