import React from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import { ListGroupItem} from 'react-bootstrap';

const goalAdder = (props) => (
    <LinkContainer to={"/goals/new"} >
        <ListGroupItem className="text-center">
            <h4><span className="glyphicon glyphicon-plus" /><b> Track New Goal</b></h4>
        </ListGroupItem>
    </LinkContainer >
)

export default goalAdder;