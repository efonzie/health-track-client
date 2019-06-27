import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { API, Storage } from "aws-amplify";
import moment from 'moment';
import { s3Upload, s3Remove, deleteNote, createNote, updateNote, loadHabits } from "../../libs/awsLib";
import HabitSelector from "../../components/Habits/HabitSelector";
import LoaderButton from "../../components/UI/LoaderButton/LoaderButton";
import LoadingIndicator from "../../components/UI/LoadingIndicator/LoadingIndicator";
import config from "../../config";
import "./EditNote.css";

export default class NewNote extends Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            habits: [],
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('HH:mm'),
            selectedHabit: null,
            isLoading: true,
            isSaving: false,
            note: ""
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }
        if (this.props.location.state && this.props.location.state.habits) {
            this.setState({ habits: this.props.location.state.habits });
        } else {
            const habits = await loadHabits();
            if (habits.length > 0) {
                this.setState({ habits: habits });
            }
        }
        if (this.props.match.params && this.props.match.params.id) {
            await this.loadNote();
        }
        this.setState({ isLoading: false });
    }

    async loadNote() {
        try {
            let attachmentURL;
            const note = await API.get("health-track", `/notes/${this.props.match.params.id}`);

            if (note.attachment) {
                attachmentURL = await Storage.vault.get(note.attachment);
            }

            // TODO: Add habit to list of habits if it doesn't exist (may have been removed after being saved)

            this.setState({
                selectedHabit: note.habit,
                note: note.note ? note.note : "",
                date: moment(note.eventDatetime).format('YYYY-MM-DD'),
                time: moment(note.eventDatetime).format('HH:mm'),
                attachment: note.attachment,
                attachmentURL: attachmentURL
            });
        } catch (e) {
            alert(e);
        }
    }

    formatFilename(str) {
        return str.replace(/^\w+-/, "");
    }

    validateForm() {
        return this.state.selectedHabit && this.state.date && this.state.time;
    }

    handleChangeNote = event => {
        this.setState({
            note: event.target.value
        });
    }

    handleChangeDate = (event) => {
        this.setState({
            date: event.target.value
        });
    }

    handleChangeTime = (event) => {
        this.setState({
            time: event.target.value
        });
    }

    handleFileChange = event => {
        this.file = event.target.files[0];
    }

    handleCreate = async event => {
        event.preventDefault();

        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
            return;
        }

        this.setState({ isSaving: true });

        try {
            const attachment = this.file
                ? await s3Upload(this.file)
                : null;

            await createNote(this.generateNoteBody(attachment));
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            console.log(e.response);
            this.setState({ isSaving: false });
        }
    }

    generateNoteBody(attachment) {
        return {
            habit: this.state.selectedHabit,
            eventDatetime: moment(this.state.date + " " + this.state.time).format(),
            note: this.state.note,
            attachment: attachment
        };
    }

    handleUpdate = async event => {
        event.preventDefault();
        
        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
            return;
        }

        this.setState({ isLoading: true });

        try {
            let attachment;
            if (this.file) {
                attachment = await s3Upload(this.file);
                if (attachment) {
                    await s3Remove(this.state.note.attachment);
                }
            }
            const noteBody = this.generateNoteBody(attachment || this.state.note.attachment)
            await updateNote(this.props.match.params.id, noteBody);
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            console.log(e.response);
            this.setState({ isLoading: false });
        }
    }

    handleDelete = async event => {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete this note?"
        );

        if (!confirmed) {
            return;
        }

        this.setState({ isDeleting: true });

        try {
            await deleteNote(this.props.match.params.id);
            await s3Remove(this.state.note.attachment);
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isDeleting: false });
        }
    }

    handleSelectHabit = (selectedHabit) => {
        this.setState({ selectedHabit: selectedHabit });
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator />;
        } else {
            return (
                <div className="EditNote">
                    <form onSubmit={this.handleCreate}>
                        <FormGroup controlId="habit">
                            <HabitSelector
                                selectHabit={this.handleSelectHabit}
                                habits={this.state.habits}
                                selectedHabit={this.state.selectedHabit} />
                        </FormGroup>
                        <div className="row">
                            <FormGroup className="col-xs-6" controlId="date">
                                <ControlLabel>Date</ControlLabel>
                                <FormControl value={this.state.date} onChange={this.handleChangeDate} type="date" />
                            </FormGroup>
                            <FormGroup className="col-xs-6" controlId="time">
                                <ControlLabel>Time</ControlLabel>
                                <FormControl value={this.state.time} onChange={this.handleChangeTime} type="time" />
                            </FormGroup>
                        </div>
                        <FormGroup controlId="note">
                            <ControlLabel>Note</ControlLabel>
                            <FormControl
                                onChange={this.handleChangeNote}
                                value={this.state.note}
                                placeholder="(Optional)"
                                type="text"
                            />
                        </FormGroup>
                        {this.state.attachment &&
                            <FormGroup>
                                <ControlLabel>Attachment</ControlLabel>
                                <FormControl.Static>
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={this.state.attachmentURL}
                                    >
                                        {this.formatFilename(this.state.attachment)}
                                    </a>
                                </FormControl.Static>
                            </FormGroup>}
                        <FormGroup controlId="file">
                            <FormControl onChange={this.handleFileChange} type="file" />
                        </FormGroup>
                        {this.props.match.params && this.props.match.params.id
                            ? <div>
                                <LoaderButton
                                    block
                                    bsStyle="primary"
                                    bsSize="large"
                                    disabled={!this.validateForm()}
                                    onClick={this.handleUpdate}
                                    isLoading={this.state.isSaving}
                                    text="Save"
                                    loadingText="Saving…"
                                />
                                <LoaderButton
                                    block
                                    bsStyle="danger"
                                    bsSize="large"
                                    isLoading={this.state.isDeleting}
                                    onClick={this.handleDelete}
                                    text="Delete"
                                    loadingText="Deleting…"
                                />
                            </div>
                            : <LoaderButton
                                block
                                bsStyle="success"
                                bsSize="large"
                                disabled={!this.validateForm()}
                                onClick={this.handleCreate}
                                isLoading={this.state.isSaving}
                                text="Add"
                                loadingText="Creating…"
                            />
                        }
                    </form>
                </div>
            );
        }
    }
}
