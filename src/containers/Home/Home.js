import React, { Component } from "react";
import moment from "moment";
import { Link, Redirect } from "react-router-dom";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { loadHabits, getNotes } from "../../libs/awsLib";
import "./Home.css";
import GoalSummaryIndicator from "../../components/Goals/GoalSummaryIndicator";
import LoadingIndicator from "../../components/UI/LoadingIndicator/LoadingIndicator";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  renderNotesList(notes) {
    return notes.map((note, i) =>
      <LinkContainer
        key={note.noteId}
        to={`/notes/${note.noteId}`}
      >
        <ListGroupItem className="form-row" header={""}>
          <div className="note-date pull-right"><b>{moment(new Date(note.eventDatetime)).format('llll')}</b></div>
          <span className="note-details"><b>{note.habit}</b> {note.note ? note.note.trim().split("\n")[0] : ""}</span>
        </ListGroupItem>
      </LinkContainer>
    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Health Track</h1>
        <p>Track your healthy habits!</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }


  renderNotes() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    } else if (this.state.habits != null && this.state.habits.length > 0) {
      return (
        <div className="notes">
          <LinkContainer
            key="new"
            to={{
              pathname: "/notes/new",
              state: { habits: this.state.habits }
            }}
          >
            <ListGroupItem className="text-center">
              <h4><span className="glyphicon glyphicon-plus" /><b> Record New Habit</b></h4>
            </ListGroupItem>
          </LinkContainer>
          <PageHeader>
            Goal Progress
            <Link to="/goals" className="btn btn-info btn-lg pull-right">
              <span className="glyphicon glyphicon-tasks"></span>
            </Link>
          </PageHeader>
          <GoalSummaryIndicator />
          <PageHeader>
            History
            <Link to="/summary" className="btn btn-info btn-lg pull-right">
              <span className="glyphicon glyphicon-stats"></span>
            </Link>
          </PageHeader>

          <ListGroup>
            {!this.state.isLoading ?
              <div>
                {this.renderNotesList(this.state.notes)}
              </div>
              :
              null}
          </ListGroup>
        </div>
      );
    } else {
      return <Redirect to={{
        pathname: "/configure",
        state: { new: true }
      }} />
    }
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
      </div>
    );
  }
}