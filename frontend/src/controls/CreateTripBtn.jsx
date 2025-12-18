import { useState } from 'react';

function CreateTripBtn() {
    const [ inputVisible, setInputVisible ] = useState(false);
    return (
        <div>
            <button className="control-button"
                onClick={() => setInputVisible(prev => !prev)}
                style={{
                    backgroundColor: inputVisible ? "gray" : "white",
                }}
            >
                create new trip
            </button>
            { inputVisible ? 
                <form>
                    <input id="popup-input">
                    </input>
                </form> : null
            }
        </div>
    )

}

export default CreateTripBtn;