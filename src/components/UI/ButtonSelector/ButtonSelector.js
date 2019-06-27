import React from 'react'
import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';

const buttonSelector = (props) => {
    const buttonList = props.items.map(item => {
        const classes = ["btn", "btn-lg"];
        if (props.selectedItem === item) {
            classes.push("btn-success");
        }
        else {
            classes.push("btn-light");
        }
        return <Button className={classes.join(" ")} key={item} onClick={() => props.selectItem(item)}>{item}</Button>;
    });
    return buttonList;
}

buttonSelector.propTypes = {
    items: PropTypes.array.isRequired,
    selectItem: PropTypes.func.isRequired,
    selectedItem: PropTypes.string
}

export default buttonSelector;