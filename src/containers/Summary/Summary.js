import React, { Component } from 'react';
import { LineChart } from 'react-chartkick';
import 'chart.js'
import moment from 'moment';
import { PageHeader } from 'react-bootstrap';
import { loadHabits, getNotes } from "../../libs/awsLib";
import LoadingIndicator from '../../components/UI/LoadingIndicator/LoadingIndicator';
import ButtonSelector from '../../components/UI/ButtonSelector/ButtonSelector';

class Summary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeScale: 'Week',
            isLoading: true,
            notes: [],
            habits: []
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }
        const habits = await loadHabits();
        if (habits.length > 0) {
            this.setState({ habits: habits });
            await this.loadNotes();
        }

        this.setState({ isLoading: false });
    }

    async loadNotes() {
        try {
            const notes = await getNotes();
            this.setState({ notes: notes });
        } catch (e) {
            alert(e);
        }
    }

    handleSelectTimeScale = (newTimeScale) => {
        this.setState({ timeScale: newTimeScale});
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator />
        }
        const chartData = this.state.habits.map(habit => {
            return { name: habit, data: {} }
        });
        for (let series of chartData) {
            let seriesNotes = this.state.notes.filter(note => {
                return note.habit === series.name;
            });
            for (let note of seriesNotes) {
                let formattedDate = moment(note.eventDatetime).startOf(this.state.timeScale).format('l');
                let count = series.data[formattedDate];
                if (!count) {
                    series.data[formattedDate] = 1;
                } else {
                    series.data[formattedDate] = count + 1;
                }
            }
        }
        return (
            <div>
                <PageHeader>
                    Summary
                </PageHeader>
                <div className="text-center">
                    <h1>Habits Recorded By</h1>
                    <ButtonSelector items={['Day', 'Week', 'Month']} selectedItem={this.state.timeScale} selectItem={this.handleSelectTimeScale}/>
                </div>
                <LineChart legend="bottom" data={chartData} />
            </div>
        );
    }
}

export default Summary;