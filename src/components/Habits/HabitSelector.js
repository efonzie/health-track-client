import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { loadHabits } from "../../libs/awsLib";
import ButtonSelector from "../UI/ButtonSelector/ButtonSelector";

class habitSelector extends Component {
    state = {
        isLoading: true,
        habits: []
    }

    async componentDidMount() {
        const habits = await loadHabits();
        if (habits.length > 0) {
            this.setState({ habits: habits });
        }
        this.setState({isLoading: false});
    }

    render() {
        if(this.state.isLoading){
            return <h2>Loading Habits...</h2>;
        }

        return <React.Fragment>
            <ButtonSelector items={this.state.habits} selectedItem={this.props.selectedHabit} selectItem={this.props.selectHabit} />
            <Link
                className="btn btn-secondary btn-lg"
                to="/configure"
            >
                <span className="glyphicon glyphicon-cog" aria-hidden="true"></span>
            </Link>
        </React.Fragment>
    }
}

habitSelector.propTypes = {
    selectHabit: PropTypes.func.isRequired,
    selectedHabit: PropTypes.string
}

export default habitSelector;