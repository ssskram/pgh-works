
// returns all tasks per phase

import * as React from 'react'
import { connect } from 'react-redux'
import ReactTable from "react-table";
import { ApplicationState } from '../../../store'
import * as TaskStore from '../../../store/tasks'
import Modal from 'react-responsive-modal'
import DeleteTask from '../../DeleteConfirmations/DeleteTask'
import TaskForm from '../../Inputs/Task'
import * as moment from 'moment'
import classnames from 'classnames'

const tasksImg = require('./../../../images/taskDark.png')

const iconStyle = {
    marginRight: '15px',
    marginTop: '-10px',
    height: '35px'
}

export class Tasks extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // utilities
            modalIsOpen: false,
            modalType: '',

            // tasks
            tasks: [],

            // delete, complete, or edit
            selectedTask: {}
        }
        this.getTasks = this.getTasks.bind(this);
    }

    componentDidMount() {
        this.getTasks(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.getTasks(nextProps)
    }

    getTasks(props) {
        if (props.tasks) {
            let tasks = props.tasks.filter(function (item) {
                return item.phaseID == props.phaseID
            })
            if (tasks.length > 0) {
                this.setState({
                    tasks: tasks.sort(function (a, b) {
                        return +new Date(b.dueDate) - +new Date(a.dueDate);
                    })
                })
            }
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            modalType: ''
        });
    }

    setNew() {
        this.setState({
            modalIsOpen: true,
            modalType: 'new'
        })
    }
    
    setDelete(taskID) {
        let task = this.state.tasks.find(function (task) {
            return task.taskID == taskID
        })
        this.setState({
            modalIsOpen: true,
            modalType: 'delete',
            selectedTask: task
        })
    }

    setEdit(taskID) {
        let task = this.state.tasks.find(function (task) {
            return task.taskID == taskID
        })
        this.setState({
            modalIsOpen: true,
            modalType: 'edit',
            selectedTask: task
        })
    }

    removeTask(task) {
        // removes task locally from state
        // done in step with mutable delete from redux store
        const tasksCopy = this.state.tasks.slice()
        tasksCopy.splice(tasksCopy.indexOf(task), 1);
        this.setState({
            tasks: tasksCopy,
            modalType: ''
        })
    }

    completeTask(taskID) {
        let task = this.state.tasks.find(function (task) {
            return task.taskID == taskID
        })
        task.percentComplete = 100
        task.dateCompleted = moment().format('MM/DD/YYYY')
        this.props.updateTask(task)
    }

    reopenTask(taskID) {
        let task = this.state.tasks.find(function (task) {
            return task.taskID == taskID
        })
        task.percentComplete = 0
        task.dateCompleted = ''
        this.props.updateTask(task)
    }

    public render() {
        const {
            modalIsOpen,
            tasks,
            selectedTask,
            modalType
        } = this.state

        const {
            canEdit
        } = this.props

        let openColumns = [] as any
        if (canEdit == true) {
            openColumns = [{
                Header: 'Name',
                accessor: 'taskName'
            }, {
                Header: 'Due date',
                accessor: 'dueDate',
                Cell: props => <span className={classnames({ redText: moment(props.value).isBefore(moment().format('MM/DD/YYYY')) })}> {props.value}</span>
            }, {
                Header: 'Notes',
                accessor: 'notes'
            }, {
                Header: '',
                accessor: 'taskID',
                Cell: props => <button onClick={() => this.completeTask(props.value)} className='btn btn-success' title='Mark as complete'><span className='glyphicon glyphicon-ok'></span></button>,
                maxWidth: 100
            }, {
                Header: '',
                accessor: 'taskID',
                Cell: props => <button onClick={() => this.setEdit(props.value)} className='btn btn-warning' title='Edit task'><span className='glyphicon glyphicon-info-sign'></span></button>,
                maxWidth: 100
            }, {
                Header: '',
                accessor: 'taskID',
                Cell: props => <button onClick={() => this.setDelete(props.value)} className='btn btn-danger' title='Delete task'><span className='glyphicon glyphicon-remove'></span></button>,
                maxWidth: 100
            }]
        } else {
            openColumns = [{
                Header: 'Name',
                accessor: 'taskName'
            }, {
                Header: 'Due date',
                accessor: 'dueDate',
                Cell: props => <span className={classnames({ redText: moment(props.value).isBefore(moment().format('MM/DD/YYYY')) })}> {props.value}</span>
            }, {
                Header: 'Notes',
                accessor: 'notes'
            }]
        }

        let closedColumns = [] as any
        if (canEdit == true) {
            closedColumns = [{
                Header: 'Task',
                accessor: 'taskName',
                Cell: props => <span style={{ textDecoration: 'line-through' }}>{props.value}</span>
            }, {
                Header: 'Due',
                accessor: 'dueDate',
                Cell: props => <span style={{ textDecoration: 'line-through' }}>{props.value}</span>
            }, {
                Header: 'Notes',
                accessor: 'notes',
                Cell: props => <span style={{ textDecoration: 'line-through' }}>{props.value}</span>
            }, {
                Header: 'Completed',
                accessor: 'dateCompleted'
            }, {
                Header: '',
                accessor: 'taskID',
                Cell: props => <button onClick={() => this.reopenTask(props.value)} className='btn btn-success' title='Mark as incomplete'><span className='glyphicon glyphicon-arrow-up'></span></button>,
                maxWidth: 100
            }]
        } else {
            closedColumns = [{
                Header: 'Task',
                accessor: 'taskName',
                Cell: props => <span style={{ textDecoration: 'line-through' }}>{props.value}</span>
            }, {
                Header: 'Due',
                accessor: 'dueDate',
                Cell: props => <span style={{ textDecoration: 'line-through' }}>{props.value}</span>
            }, {
                Header: 'Notes',
                accessor: 'notes',
                Cell: props => <span style={{ textDecoration: 'line-through' }}>{props.value}</span>
            }, {
                Header: 'Completed',
                accessor: 'dateCompleted'
            }]
        }

        const openTasks = tasks.filter(function (item) {
            return item.percentComplete < 100
        })

        const completedTasks = tasks.filter(function (item) {
            return item.percentComplete == 100
        })

        return (
            <div className='row'>
                <h2>
                    <img style={iconStyle} src={tasksImg as string} />
                    Tasks
                    <span>
                        {canEdit == true &&
                            <div onClick={this.setNew.bind(this)} title='Add task' className='btn-add pull-right hidden-xs'>
                                <span style={{ marginTop: '10px' }} className='glyphicon glyphicon-plus'></span>
                            </div>
                        }
                    </span>
                </h2>
                <hr />
                {tasks.length == 0 &&
                    <h4 className='text-center'><i>No tasks</i></h4>
                }
                {openTasks.length > 0 &&
                    <div className='col-md-12'>
                        <h4><b>Open tasks</b></h4>
                        <ReactTable
                            data={openTasks}
                            columns={openColumns}
                            loading={false}
                            minRows={0}
                            pageSize={100}
                            showPagination={false}
                            showPageSizeOptions={false}
                            noDataText=''
                            getTdProps={() => ({
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    fontSize: '18px'
                                }
                            })}
                        />
                    </div>
                }
                {completedTasks.length > 0 && openTasks.length > 0 &&
                    <div className='col-md-12'><br /><br /></div>
                }
                {completedTasks.length > 0 &&
                    <div className='col-md-12'>
                        <h4><b>Completed tasks</b></h4>
                        <ReactTable
                            data={completedTasks}
                            columns={closedColumns}
                            loading={false}
                            minRows={0}
                            pageSize={100}
                            showPagination={false}
                            showPageSizeOptions={false}
                            noDataText=''
                            getTdProps={() => ({
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    fontSize: '16px'
                                }
                            })}
                        />
                    </div>
                }
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    {modalType == 'delete' &&
                        <DeleteTask
                            task={selectedTask}
                            closeModal={this.closeModal.bind(this)}
                            removeTask={this.removeTask.bind(this)} />
                    }
                    {modalType == 'new' &&
                        <TaskForm
                            phaseID={this.props.phaseID}
                            projectID={this.props.projectID}
                            closeModal={this.closeModal.bind(this)} />
                    }
                    {modalType == 'edit' &&
                        <TaskForm
                            task={selectedTask}
                            phaseID={this.props.phaseID}
                            projectID={this.props.projectID}
                            closeModal={this.closeModal.bind(this)} />
                    }
                </Modal>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.tasks
    }),
    ({
        ...TaskStore.actionCreators
    })
)(Tasks as any) as typeof Tasks