import { useState } from 'react';
import CountryList from './CountryList';
import Trie from './Trie';
import DialogueBox from './DialogueBox';

function CreateTripBtn() {
    const [input, setInput] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const data = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua & Deps","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Central African Rep","Chad","Chile","China","Colombia","Comoros","Congo","Congo (Democratic Rep)","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland {Republic}","Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Korea North","Korea South","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar (Burma)","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","St Kitts & Nevis","St Lucia","Saint Vincent & the Grenadines","Samoa","San Marino","Sao Tome & Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"]

    const trie = new Trie()
    for (let i = 0; i < data.length; i++) {
        trie.insert(data[i]);
    }

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        const { value } = e.target;
        setInput(value);
    }

    const nowUtc = new Date();
    // Get the date part (YYYY-MM-DD)
    const formattedDateUtc = nowUtc.toISOString().split('T')[0];

    const dialogueContent = 
        <form className="space-y-4">
            <div className="space-y-1">
                <label htmlFor="trip-name" className="text-sm font-medium text-zinc-700">Trip name</label>
                <textarea id="trip-name" name="tripName" rows={2} className="w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"></textarea>
            </div>

            <div className="relative space-y-1">
                <label htmlFor="country-name" className="text-sm font-medium text-zinc-700">Country</label>
                <input id="country-name" className="country-name w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70" onInput={handleInput} />
                <CountryList trie={trie} input={input} setInput={setInput} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                    <label htmlFor="trip-start" className="text-sm font-medium text-zinc-700">Start date</label>
                    <input id="trip-start" type="date" defaultValue={formattedDateUtc} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70" />
                </div>

                <div className="space-y-1">
                    <label htmlFor="trip-end" className="text-sm font-medium text-zinc-700">End date</label>
                    <input id="trip-end" type="date" defaultValue={formattedDateUtc} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70" />
                </div>
            </div>

            <div className="space-y-1">
                <label htmlFor="trip-description" className="text-sm font-medium text-zinc-700">Description</label>
                <textarea id="trip-description" name="description" rows={5} className="w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"></textarea>
            </div>
        </form>


    return (
        <div className="w-28">
            <button className="control-button w-full" 
                onClick={() => setIsDialogOpen(true)}
            >
                Create trip
            </button>

            <DialogueBox
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Create New Trip"
            >
                {dialogueContent}
            </DialogueBox>
        </div>
    )

}

export default CreateTripBtn;