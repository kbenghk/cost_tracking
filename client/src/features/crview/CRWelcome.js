/******************************************************************************
 * TODO: 
 * 1. Add option to switch default Activity Nov 3 2023
 * - add a toggle button to Enable / Disable the function ( the div container)
 * - new <div> container starts hidden
 * - prepare activities option from user activity list
 * - update to user and refresh.
 *******************************************************************************/
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'
// import { useEffect, useState, useContext } from "react"
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux'
import { selectActivity } from '../../components/site/siteSlice'
import { useUpdateUsersMutation, useUpdateUserMutation } from '../users/usersApiSlice';
import { usePostHrsByEIdSEQuery } from '../attendance/attendsApiSlice'
const Welcome = () => {
    const { userid, username, employeename, isManager, isAdmin, status, location } = useAuth()
    useTitle(`Site: ${username}`)

    const Activities = useSelector(selectActivity)
    const activities = Activities.activities
    let currActivityId = Activities.current.activityId
    let currActivityName = Activities.current.name
    //console.log(`sitewelcome activities:${JSON.stringify(activities)}`)
    // console.log(`activities.length : ${activities?.length}`)
    const { data: attends, isSuccess, isError, error } = usePostHrsByEIdSEQuery({
        "eid": "96",
        "start": "1-07-2023",
        "end": "18-07-2023"
    })
    const [updateUsers, {
        //isLoading, isSuccess, isError, error
    }] = useUpdateUsersMutation()

    const onCurrActivtyChange = (e) => {
        e.preventDefault()
        const value = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setTimeout(() => {
            try {
                updateDefaultActivity(e.target[e.target.selectedIndex].value)
            } catch (err) {
                console.log(`siteWelcome updateDefaultActivity error: ${err}`)
            }
        }, 500)
    }
    const updateDefaultActivity = (activityId) => {
        let user = {}
        user._id = userid
        user.currActivityId = activityId
        let req = {}
        req.data = [user]
        updateUsers(req)
            .then((result) => {
                window.location.reload(false);
            }).catch((error) => {
                console.log(`error: ${error}`)
            })
    }
    let options
    if (activities) {
        options = activities?.map(activity => {
            return (
                <option
                    key={activity._id}
                    value={activity._id}

                > {activity.name}</option >
            )
        });
        if (!currActivityId && activities?.length === 1) {
            setTimeout(() => {
                currActivityName = activities[0]?.name
            }, 1500)
        } else {
            currActivityName = activities?.map(activity => {
                if (activity._id === currActivityId) {
                    return (activity.name)
                }
            })
        }
    }

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    let content = (
        <section className="welcome">
            <div className="container" style={{ fontSize: '12px' }}>
                <div id="welcome" style={{ marginTop: "50px" }} className="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                    <p>{today}</p>

                    <h4>Welcome to Control Room View :{employeename}!</h4>
                    <br />

                    <p> Select Project -- activity</p>
                    <p> get a list of all project - activities.</p>
                    <p> Select Employee -- all or Single</p>

                    <p><Link to="/crview/manhour">show manhour</Link></p>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-sm-1'>
                                #
                            </div>
                            <div className='col-sm-1'>
                                Project
                            </div>
                            <div className='col-sm-2'>
                                Activity
                            </div>
                            <div className='col-sm-2'>
                                Employee
                            </div>
                            <div className='col-sm-2'>
                                Man Hour
                            </div>
                            <div className='col-sm-2'>
                                Consumables
                            </div>
                            <div className='col-sm-2'>
                                Expenses
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
    return content
}
export default Welcome