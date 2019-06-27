import React, { Component } from 'react';
import { PageHeader, Button, Badge, FormControl, ListGroup, InputGroup, ListGroupItem } from "react-bootstrap";
import { API } from "aws-amplify";
import { loadHabits } from "../../libs/awsLib"
import "./Configure.css";
import LoadingIndicator from "../../components/UI/LoadingIndicator/LoadingIndicator";
import LoaderButton from "../../components/UI/LoaderButton/LoaderButton";

class Configure extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isValid: true,
            isLoading: true,
            isSaving: false,
            newHabit: "",
            habits: []
        };
    }

    async componentDidMount() {
        const locationState = this.props.location.state;
        if (!locationState || !locationState.new) {
            const habits = await loadHabits();
            this.setState({ habits: habits });
        }
        this.setState({ isLoading: false });
    }

    getConfigs() {
        return API.get("health-track", "/configs");
    }


    validateForm() {
        return this.state.habits.length > 0;
    }

    handleAddHabit = () => {
        const newHabit = this.titleCase(this.state.newHabit);
        if (newHabit !== '') {
            const habits = [...this.state.habits];
            if (habits.indexOf(newHabit) >= 0) {
                this.setState({ isValid: false });
            } else {
                habits.push(newHabit);
                this.setState({ isValid: true, newHabit: "", habits: habits });
            }
        }
    }

    titleCase(str) {
        return str.toLowerCase().split(' ').map(function (word) {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleAddHabit();
        }
    }

    handleDeleteHabit = (habit) => {
        const habits = [...this.state.habits];
        habits.splice(habits.indexOf(habit), 1);
        this.setState({ habits: habits });
    }

    handleChange = event => {
        this.setState({
            newHabit: event.target.value
        });
    }

    handleSaveConfigs = async event => {
        this.setState({ isSaving: true });

        try {
            await API.put("health-track", "/configs", {
                body: { habits: this.state.habits }
            });
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            console.log(e.response)
            this.setState({ isSaving: false });
        }
    }

    renderHabitsList() {
        const habits = this.state.habits;
        return [{}].concat(habits).map(
            (habit, i) =>
                i !== 0
                    ?
                    <ListGroupItem className="clearfix" key={habit}>
                        <span className="habit">{habit}</span>
                        <Button className="btn btn-danger pull-right" onClick={() => this.handleDeleteHabit(habit)}>
                            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                        </Button>

                    </ListGroupItem>
                    :
                    <ListGroupItem className="clearfix" key="__new__">
                        <InputGroup className="input-group input-group-lg">
                            <FormControl
                                onChange={this.handleChange}
                                onBlur={this.handleAddHabit}
                                onKeyDown={this.handleKeyDown}
                                value={this.state.newHabit}
                                placeholder="e.g. Yoga, Hike, Drink Water..."
                                type="text"
                            />
                            <InputGroup.Button>
                                <Button bsStyle="success" onClick={this.handleAddHabit}>
                                    <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                </Button>
                            </InputGroup.Button>
                        </InputGroup>
                        {!this.state.isValid ? <span><Badge pill className="progress-bar-danger">This habit already exits!</Badge></span> : null}
                    </ListGroupItem>
        );
    }

    render() {
        return (
            <div className="Configure">
                <PageHeader>Enter habits to track</PageHeader>
                {this.state.isLoading
                    ?
                    <LoadingIndicator />
                    :
                    <div>
                        <ListGroup>
                            {this.renderHabitsList()}
                        </ListGroup>
                        <LoaderButton
                            block
                            className="btn-success"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            onClick={this.handleSaveConfigs}
                            isLoading={this.state.isSaving}
                            text="Save"
                            loadingText="Saving…"
                        />
                    </div>
                }
            </div>
        );
    }
}

export default Configure;