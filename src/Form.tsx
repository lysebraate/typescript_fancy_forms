import React from 'react';
import { useTypedController } from '@hookform/strictly-typed';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
    flat: z.string().min(5),
    leaderboard: z.array(z.object({
        handle: z.string().min(3),
        score: z.number()
    }))
    /*nested: z.object({
        object: z.object({
            test: z.string()
        }),
        array: z.array(
            z.object({
                test: z.string()
            })
        )
    }).optional()*/
});

type Score = {
    handle: string,
    score: number
}
type FormValues = {
    flat: string;
    leaderboard: Score[];
    /*nested?: {
        object: { test: string };
        array: { test: boolean }[];
    };*/
};

export default function Form() {

    const { 
        control, 
        handleSubmit, 
        errors,
        formState: { isDirty, dirtyFields }
    } = useForm<FormValues>({
        mode: 'onChange',
        resolver: zodResolver(schema),
    });
    const TypedController = useTypedController<FormValues>({ control });

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "leaderboard", // unique name for your Field Array
        // keyName: "id", default to "id", you can change the key name
    });
    
    
    const validationClasses = (hasErrors: boolean, isDirty: boolean) => {
        return hasErrors ? "is-danger" : isDirty ? "is-success" : "";
    }

    const inputClasses = (hasErrors: boolean, isDirty: boolean) => {
        return `input ${validationClasses(hasErrors, isDirty)}`
    }

    const formHasErrors: boolean = Object.keys(errors).length > 0;

    const onSubmit = (data: any, e: any) => console.log('SUCCESS', data, e);
    const onError = (errors: any, e: any) => console.log('ERROR', errors, e);

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="columns is-multiline">
            <div className="column is-full">
                <div className="field">
                    <label className="label">Label</label>
                    <div className="control">
                        <TypedController
                            name="flat"
                            defaultValue=""
                            render={(props) => (
                                <input 
                                    {...props} 
                                    className={inputClasses(!!(errors.flat), !!(dirtyFields.flat))} 
                                    placeholder="Text input" 
                                />)}
                        />
                    </div>
                    <div>{errors.flat?.message}</div>
                    <p className="help">This is a help text</p>
                </div>
                <div className="field">
                    <label className="label">Leaderboard</label>
                    <div className="columns is-multiline">
                    {fields.map((field, index) => {
                        const leaderBoardIsDirty = dirtyFields.leaderboard ? dirtyFields.leaderboard[index] : undefined;
                        const leaderBoardErrors = errors.leaderboard ? errors.leaderboard[index] : undefined;

                        return (
                            <div key={index} className="column is-half">
                                <TypedController
                                    name={['leaderboard', index, 'handle']}
                                    defaultValue=""
                                    render={({onChange, value, ...rest}) => (
                                        <input 
                                            {...rest}
                                            className={inputClasses(!!(leaderBoardErrors?.handle), !!(leaderBoardIsDirty?.handle))}
                                            placeholder="Handle"
                                            value={value} 
                                            onChange={(e) => onChange(e.target.value)} 
                                        />
                                    )}
                                />
                                <div>{leaderBoardErrors?.handle?.message}</div>
                                <TypedController
                                    name={['leaderboard', index, 'score']}
                                    defaultValue={0}
                                    render={({onChange, value, ...rest}) => (
                                        <input 
                                            {...rest}
                                            className={inputClasses(!!(leaderBoardErrors?.score), !!(leaderBoardIsDirty?.score))}
                                            placeholder="Score" 
                                            value={value}
                                            onChange={(e) => {
                                                onChange(Number.parseInt(e.target.value))
                                            }} 
                                        />
                                    )}
                                />
                                <div>{leaderBoardErrors?.score?.message}</div>
                            </div>
                        )
                    })}
                    </div>
                </div>
            </div>
            <div className="column columns level">
                <div className="level-left">
                    <div className="column">
                        <button className="button is-info" onClick={(e) => {
                            e.preventDefault();
                            append({});
                        }}>Add</button>
                    </div>
                    <div className="column">
                        <input type="submit" className="button is-primary" disabled={formHasErrors || !isDirty} />
                    </div>
                </div>
            </div>
            </div>
        </form>
    );

}