export default function List({ trie, input, setInput }) {
  function listItems(trie) {
    const node = trie.startsWith(input);
    const countries = trie.getAllWords(node);
    return countries.map((item) => <li className="autofill-item" onClick={() => setInput(item)} style={{listStyle: "none", background: "white", cursor: "pointer"}} key={item}>{item}</li>);
  }

  if (!input) return <div />;

  return <ul>{listItems(trie)}</ul>;
}
