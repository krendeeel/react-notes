import React, { useState, useEffect } from "react";
import { v4 } from 'uuid';
import { randomColor } from 'randomcolor';
import Draggable from 'react-draggable';
import { useRef } from "react";

const Notes = () => {
    const ref = useRef();
    const [inputValue, setInputValue] = useState('');
    const [items, setItems] = useState(
        JSON.parse(localStorage.getItem('items')) || []
    );

    useEffect(() => {
        localStorage.setItem('items', JSON.stringify(items));
    }, [items])

    const newItem = (e) => {
        e.preventDefault();
        const newItem = {
            id: v4(),
            item: inputValue,
            color: randomColor({
                luminosity: "light"
            }),
            defaultPosition: {
                x: ref.current.getBoundingClientRect().x,
                y: -(ref.current.getBoundingClientRect().y)
            }
        };
        setItems((items) => [...items, newItem]);
        setInputValue('');
    };

    const changeHandler = e => setInputValue(e.target.value);


    const deleteItem = id => {
        const newItems = items.filter(i => i.id !== id);
        setItems(newItems);
    };

    const updatePosition = (data, index) => {
        const newItems = [...items];
        newItems[index].defaultPosition = {
            x: data.x,
            y: data.y
        };
        setItems(newItems);
    }

    return (
        <>
            <div className="wrapper">
                <h1 ref={ref}>React Notes</h1>
                <form onSubmit={newItem}>
                    <input
                        type="text"
                        placeholder="Напишите что-нибудь..."
                        value={inputValue}
                        onChange={changeHandler}
                        required
                    />
                    <button
                        className="enter"
                        type="submit"
                    >
                        Добавить
                    </button>
                    <span>
                        Вы можете перетащить заметку в любое место на экране
                    </span>
                </form>


            </div>
            {
                items.map((item, index) => (
                    <Draggable
                        key={item.id}
                        defaultPosition={item.defaultPosition}
                        onStop={(_, data) => {
                            updatePosition(data, index);
                        }}
                    >
                        <div className="note" style={{ background: item.color }}>
                            {item.item}
                            <button
                                className="delete"
                                onClick={() => deleteItem(item.id)}
                            >
                                x
                            </button>
                        </div>
                    </Draggable>
                ))
            }
        </>
    )
}

export default Notes