export default function List({ trie, input, setInput }) {

  function clickItem(item) {
    document.getElementById("country-name").value = item;
    setInput("");
  }

  function listItems(trie) {
    const node = trie.startsWith(input);
    const countries = trie.getAllWords(node);
    return countries.map((item) => <li className="autofill-item" onClick={() => clickItem(item)} key={item}>{item}</li>);
  }

  if (!input) return <div />;

  return <ul className="country-list">{listItems(trie)}</ul>;
}
