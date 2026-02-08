import { CountryListProps } from "../../../Types/Props"
import Trie from "./Trie";

export default function CountryList({ trie, input, setInput }: CountryListProps) {

  function clickItem(item: string) {
    document.getElementsByClassName("country-name")[0].value = item;
    setInput("");
  }

  function listItems(trie: Trie) {
    const node = trie.startsWith(input);
    const countries = trie.getAllWords(node);
    return countries.map((item: string) => <li className="autofill-item" onClick={() => clickItem(item)} key={item}>{item}</li>);
  }

  if (!input) return <div />;

  return <ul className="country-list">{listItems(trie)}</ul>;
}
