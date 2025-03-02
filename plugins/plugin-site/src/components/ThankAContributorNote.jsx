/* eslint-disable react/jsx-one-expression-per-line */

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Papa from 'papaparse';
import placeholderImage from '../images/person-circle-outline.svg';

function ThankAContributorNote() {
    const [thankYou, setThankYou] = useState({});
    const [imageError, setImageError] = useState(false);

    const dataUrl = 'https://raw.githubusercontent.com/jenkins-infra/jenkins-contribution-stats/main/data/honored_contributor.csv';

    useEffect(() => {
        axios
            .get(
                dataUrl,
                {responseType: 'text'}
            )
            .then((response) => {
                if (Papa.parse(response.data)?.data[1]) {
                    const data = Papa.parse(response.data)?.data[1];
                    setThankYou(Papa.parse(response.data)?.data[1] ? {
                        'RUN_DATE': data[0],
                        'MONTH': data[1],
                        'GH_HANDLE': data[2],
                        'FULL_NAME': data[3],
                        'COMPANY': data[4],
                        'GH_HANDLE_URL': data[5],
                        'GH_HANDLE_AVATAR': data[6],
                        'NBR_PRS': data[7],
                        'REPOSITORIES': data[8],
                    }: {});
                }
            });

        const interval = setInterval(() => {
            axios
                .get(
                    dataUrl,
                    {responseType: 'text'}
                )
                .then((response) => {
                    if (Papa.parse(response.data)?.data[1]) {
                        const data = Papa.parse(response.data)?.data[1];
                        setThankYou(Papa.parse(response.data)?.data[1] ? {
                            'RUN_DATE': data[0],
                            'MONTH': data[1],
                            'GH_HANDLE': data[2],
                            'FULL_NAME': data[3],
                            'COMPANY': data[4],
                            'GH_HANDLE_URL': data[5],
                            'GH_HANDLE_AVATAR': data[6],
                            'NBR_PRS': data[7],
                            'REPOSITORIES': data[8],
                        }: {});
                    }
                });
        }, 3600000);

        return () => clearInterval(interval);
    }, []);


    return (
        <div
            className="thank-you-block"
        >
            <div
                className="thank-you-box"
            >
                <div
                    className="contributor-data"
                >
                    <div
                        className="image-div"
                    >
                        <img
                            src={imageError || !thankYou['GH_HANDLE_AVATAR'] ? placeholderImage : thankYou['GH_HANDLE_AVATAR'].replace(/['"]+/g, '')}
                            alt="Random contributor image"
                            onError={()=>setImageError(true)}
                        />
                    </div>
                    <div
                        className="desc-div"
                    >
                        <p>
                            Thank you{' '}
                            {Object.values(thankYou)?.filter((item) => item?.trim() === '')
                                .length === 0 && (<a target="_blank" rel="noreferrer" href={thankYou['GH_HANDLE_URL']?.replace(/['"]+/g, '')}>{thankYou['FULL_NAME']?.replace(/['"]+/g, '').trim() ? thankYou['FULL_NAME']?.replace(/['"]+/g, '') : thankYou['GH_HANDLE']?.replace(/['"]+/g, '').trim() ? thankYou['GH_HANDLE']?.replace(/['"]+/g, '') : 'Contributor'}</a>
                            )}
                            <br/>for making {thankYou['NBR_PRS']?.replace(
                                /['"]+/g,
                                ''
                            )} pull{' '}
                            {parseInt(thankYou['NBR_PRS']?.replace(/['"]+/g, '')) >= 2
                                ? 'requests'
                                : 'request'}
                            <br/>to{' '}
                            {thankYou['REPOSITORIES']?.split(' ')?.length >= 4
                                ? `${parseInt(thankYou['REPOSITORIES']?.split(' ')?.length)} Jenkins `
                                : 'the '}
                            {thankYou['REPOSITORIES']?.split(' ').length < 4 &&
                                thankYou['REPOSITORIES']
                                    ?.replace(/['"]+/g, '')
                                    .split(/\s+/)
                                    .filter(Boolean)
                                    .map((repo, idx) => (
                                        <>
                                            {thankYou['REPOSITORIES']?.split(' ').length >
                                                2 &&
                                                idx ===
                                                thankYou['REPOSITORIES']?.split(' ')
                                                    .length -
                                                2 &&
                                                ' and '
                                            }
                                            <a
                                                target="_blank"
                                                rel="noreferrer"
                                                href={`https://github.com/${repo}`}
                                            >
                                                {repo?.split('/')[1]}
                                            </a>
                                            {thankYou['REPOSITORIES']?.split(' ').length >=
                                            2 && idx < thankYou['REPOSITORIES']?.split(' ').length - 2 ? (<>,</>) : (<>{' '}</>)}
                                        </>
                                    ))}{' '}
                            {thankYou['REPOSITORIES']?.split(' ').length > 2
                                ? 'repos'
                                : 'repo'}{' '}
                            in{' '}
                            {dayjs(thankYou['MONTH']?.replace(/['"]+/g, '').trim()).format(
                                'MMMM YYYY'
                            )}
                            !
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThankAContributorNote;
