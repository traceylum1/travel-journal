class Trie {
  constructor() {
    this.root = {};
  }

  insert(word) {
    let node = this.root;
    for (let c of word) {
        const cLowerCase = c.toLowerCase();
        if (node[cLowerCase] == null) node[cLowerCase] = {};
        node = node[cLowerCase];
    }
    node.word = word;
  }

  traverse(word) {
    let node = this.root;
    for (let c of word) {
      node = node[c];
      if (node == null) return null;
    }
    return node;
  }

  search(word) {
    const node = this.traverse(word);
    return node != null && node.isWord === true;
  }

  startsWith(prefix) {
    return this.traverse(prefix);
  }

  getAllWords(node) {
    if (node === null) {
        return [];
    } else if (node && ("word" in node)) { 
        return [node.word]
    } 

    let res = [];

    for (const nextNode of Object.values(node)) {
        const foundWord = this.getAllWords(nextNode)
        res = res.concat(foundWord);
    }
    return res;
  }
}


export default Trie;