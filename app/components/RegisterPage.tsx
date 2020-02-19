import React, {useCallback} from 'react';

const RegisterPage = () => {

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        // eslint-disable-next-line no-console
        console.log('test!');
    }, []);

    return (
        <div>
            RecoverPage
            <form onSubmit={handleSubmit}>
                <input name="email" type="text" />
                <input name="password" type="password" />
                <input name="password_repeat" type="password" />

                <button type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;