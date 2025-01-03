/* eslint-disable react/jsx-one-expression-per-line */

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {Box, Stack, useTheme} from '@mui/material';
import Papa from 'papaparse';
import {useMediaQuery} from '../hooks/useMediaQuery';

function ThankAContributorNote() {
    const theme = useTheme();
    const isMobile = useMediaQuery('man-width: 768px)');
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const [thankYou, setThankYou] = useState([]);

    useEffect(() => {
        axios
            .get(
                'https://raw.githubusercontent.com/jenkins-infra/jenkins-contribution-stats/main/data/honored_contributor.csv',
                {responseType: 'text'}
            )
            .then((response) => {
                setThankYou(Papa.parse(response.data)?.data[1]);
            });

        const interval = setInterval(() => {
            axios
                .get(
                    'https://raw.githubusercontent.com/jenkins-infra/jenkins-contribution-stats/main/data/honored_contributor.csv',
                    {responseType: 'text'}
                )
                .then((response) => {
                    setThankYou(Papa.parse(response.data)?.data[1]);
                });
        }, 3600000);

        return () => clearInterval(interval);
    }, []);


    return (
        <Box
            sx={{
                padding: theme.spacing(5, 2),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    padding: isMobile ? theme.spacing(2) : theme.spacing(3),
                    borderRadius: 5,
                    maxWidth: 'fit-content',
                    height: 'fit-content',
                    backgroundColor: 'rgb(218, 209, 198, 0.3)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Stack
                    direction="row"
                    gap={isMobile ? 1 : 3}
                    justifyItems="center"
                    alignItems="center"
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <img
                            src={thankYou[6]?.replace(/['"]+/g, '')}
                            alt="Random contributor image"
                            width={isDesktop ? 100 : isMobile ? 36 : 90}
                            height={
                                isDesktop ? 100 : isMobile ? '100%' : 90
                            }
                            style={{
                                marginTop: 'auto',
                                marginBottom: 'auto',
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            fontSize: isMobile ? 'small' : 'medium',
                        }}
                    >
                        Thank you{' '}
                        {thankYou?.filter((item) => item?.trim() === '')
                            .length === 0 && (<a target="_blank" rel="noreferrer" href={thankYou[5]?.replace(/['"]+/g, '')}>{thankYou[3]?.replace(/['"]+/g, '').trim() ? thankYou[3]?.replace(/['"]+/g, '') : thankYou[2]?.replace(/['"]+/g, '')}</a>
                        )}
                        <br/>for making {thankYou[7]?.replace(
                            /['"]+/g,
                            ''
                        )} pull{' '}
                        {parseInt(thankYou[7]?.replace(/['"]+/g, '')) >= 2
                            ? 'requests'
                            : 'request'}
                        <br/>to{' '}
                        {thankYou[8]?.split(' ')?.length >= 4
                            ? `${parseInt(thankYou[8]?.split(' ')?.length)} Jenkins `
                            : 'the '}
                        {thankYou[8]?.split(' ').length < 4 &&
                            thankYou[8]
                                ?.replace(/['"]+/g, '')
                                .split(/\s+/)
                                .filter(Boolean)
                                .map((repo, idx) => (
                                    <>
                                        {thankYou[8]?.split(' ').length >
                                            2 &&
                                            idx ===
                                            thankYou[8]?.split(' ')
                                                .length -
                                            2 &&
                                            'and '
                                        }
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            href={`https://github.com/${repo}`}
                                        >
                                            {repo?.split('/')[1]}
                                        </a>
                                        {thankYou[8]?.split(' ').length >=
                                        2 && idx < thankYou[8]?.split(' ').length - 2 ? (<>,</>) : (<>{' '}</>)}
                                    </>
                                ))}{' '}
                        {thankYou[8]?.split(' ').length > 2
                            ? 'repos'
                            : 'repo'}{' '}
                        in{' '}
                        {dayjs(thankYou[1]?.replace(/['"]+/g, '')).format(
                            'MMMM YYYY'
                        )}
                        !
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}

export default ThankAContributorNote;
