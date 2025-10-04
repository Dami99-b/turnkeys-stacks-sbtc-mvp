
export const STX_NODE = process.env.STX_NODE_URL || 'https://stacks-node-api.testnet.stacks.co';
export function explorerForTx(txid) {
  return `https://explorer.testnet.stacks.co/txid/${txid}`;
}
