import { TextField } from '@material-ui/core'
import { ChangeEvent, useEffect, useState } from 'react';
import User from '../../models/User';
import Store from '../../redux/Store';
import UsersUtils from '../../Utils/UsersUtils';
import UserItem from '../user-item/UserItem';
import './SearchUsersSection.css';


export default function SearchUsersSection() {

    const [messageReceiver, setMessageReceiver] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [allUsers, setAllUsers] = useState<User[]>(new Array<User>());
    const [filteredUsers, setFilteredUsers] = useState<User[]>(new Array<User>());

    useEffect(() => {

        checkIfShouldGetAllUsersFromServer();

        const unsubscribe = Store.subscribe(() => {
            const composedMessageFromStore = Store.getState().composedMessage;
            setMessageReceiver(composedMessageFromStore.receiverUsername);
        });

        return () => {
            unsubscribe();
        }
    }, []);


    const checkIfShouldGetAllUsersFromServer = async (): Promise<void> => {
        const allUsersFromStore = Store.getState().allUsers;
        if (allUsersFromStore.length === 0) {
            const allUsersFormServer = await UsersUtils.getAllUsersFromServer();
            setAllUsers(allUsersFormServer);
        }
        else {
            setAllUsers(allUsersFromStore);
        }
    }

    const onSearchUserInputChange = (event: ChangeEvent <HTMLInputElement>): void => {
        const searchInput: HTMLInputElement = event.target;
        const searchValue = searchInput.value;
        const filteredUsers = UsersUtils.filterUsersBasedOnSearchInput(allUsers, searchValue);
        setFilteredUsers(filteredUsers);
        setSearchValue(searchValue);
    }

    return (
        <div className="composeEmailSectionRight">
            <TextField onChange={onSearchUserInputChange} value={searchValue} required label="Search For a User" />
            {messageReceiver.trim() !== "" && <h3 className="receiverText">To: {messageReceiver}</h3>}

            <div className="allUsersItemsSection">
                {filteredUsers.map( (user, index) => 
                    <UserItem key={index} {...user} />
                )}
            </div>
        </div>
    )
}