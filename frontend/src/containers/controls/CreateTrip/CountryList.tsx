import { CountryListProps } from '../../../Types/Props';
import Trie from './Trie';

export default function CountryList({ trie, input, setInput }: CountryListProps) {

  function clickItem(item: string) {
    document.getElementsByClassName("country-name")[0].value = item;
    setInput("");
  }

  function listItems(trie: Trie) {
    const node = trie.startsWith(input);
    const countries = trie.getAllWords(node);
    return countries.map((item: string) => (
      <li
        className="cursor-pointer border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:bg-emerald-100"
        onClick={() => clickItem(item)}
        key={item}
      >
        {item}
      </li>
    ));
  }

  if (!input) return <div />;

  return (
    <ul className="absolute z-20 mt-1 max-h-40 w-[calc(100%-1.5rem)] overflow-y-auto rounded-md bg-white shadow-md">
      {listItems(trie)}
    </ul>
  );
}
