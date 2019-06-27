import React, { Component } from 'react';
import { PageHeader, FormGroup, FormControl } from 'react-bootstrap';
import {saveGoal} from '../../libs/awsLib';
import HabitSelector from '../../components/Habits/HabitSelector';
import LoaderButton from '../../components/UI/LoaderButton/LoaderButton';
import ButtonSelector from '../../components/UI/ButtonSelector/ButtonSelector';

class NewGoal extends Component {
    state = {
        habit: null,
        target: '',
        measure: null,
        isSaving: false
    }

    handleSelectHabit = (selected) => {
        this.setState({ habit: selected });
    }

    handleSetTarget = (event) => {
        this.setState({ target: event.target.value })
    }

    handleSelectMeasure = (measure) => {
        this.setState({ measure: measure })
    }

    validateForm() {
        return this.state.habit && this.state.target && this.state.measure;
    }

    handleCreate = async event => {
        event.preventDefault();
        this.setState({ isSaving: true });
        try {
            await saveGoal(this.state.habit, this.state.target, this.state.measure);
            this.props.history.push("/goals");
        } catch (e) {
            alert(e);
            this.setState({ isSaving: false });
        }
    }

    render() {
        return (
            <div className="NewGoal">
                <PageHeader>New Goal</PageHeader>
                <form>
                    <FormGroup controlId="habit">
                        <div>
                            <HabitSelector selectHabit={this.handleSelectHabit} habits={this.state.habits} selectedHabit={this.state.habit} />
                        </div>
                    </FormGroup>
                    <FormGroup controlId="date">
                        <div className="input-group input-group-lg">
                            <FormControl className="form-control form-control-lg" value={this.state.target} onChange={this.handleSetTarget} placeholder="Target" type="number" />
                            <span className="input-group-addon">Times Per</span>
                        </div>
                    </FormGroup>
                    <FormGroup controlId="date">
                        <div>
                            <ButtonSelector items={["Day", "Week", "Month"]} selectedItem={this.state.measure} selectItem={this.handleSelectMeasure} />
                        </div>
                    </FormGroup>
                    <LoaderButton
                        block
                        bsStyle="success"
                        bsSize="large"
                        disabled={!this.validateForm()}
                        onClick={this.handleCreate}
                        isLoading={this.state.isSaving}
                        text="Add"
                        loadingText="Creating…"
                    />
                </form>
            </div>
        )
    }
}

export default NewGoal;