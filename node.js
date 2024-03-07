const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
const fetch = require('node-fetch');
const chalk = require('chalk');
const nacl = require('tweetnacl');
const fs = require('fs');
const moment = require('moment');
const cron = require('node-cron');


const createAccountSolana = () => {
    const walletKeypair = Keypair.generate()
    const privateKey = walletKeypair.secretKey;
    const publicKey = walletKeypair.publicKey;

    // Mendapatkan string dari privateKey dan publicKey
    const privateKeyBs58 = bs58.encode(privateKey);
    const publicKeyString = publicKey.toBase58();

    return {
        walletKeypair,
        privateKeyBs58,
        publicKeyString
    }
};

const getSession = () => new Promise((resolve, reject) => {
    fetch('https://nox.solanaspaces.com/spaces_nft_list_one/session', {
        method: 'POST',
        headers: {
            'authority': 'nox.solanaspaces.com',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.6',
            'content-length': '0',
            'content-type': 'application/json',
            'origin': 'https://drip.haus',
            'referer': 'https://drip.haus/',
            'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Brave";v="114"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-gpc': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        }
    }).then(res => res.json())
        .then(res => resolve(res))
        .catch(err => reject(err))
});

const verifyPubkey = (sessionId, signature, address) => new Promise((resolve, reject) => {
    fetch('https://nox.solanaspaces.com/spaces_nft_list_one/pubkey/verify', {
        method: 'POST',
        headers: {
            'authority': 'nox.solanaspaces.com',
            Authorization: `Bearer ${sessionId}`,
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.6',
            'content-length': '0',
            'content-type': 'application/json',
            'origin': 'https://drip.haus',
            'referer': 'https://drip.haus/',
            'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Brave";v="114"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-gpc': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        },
        body: JSON.stringify({
            signature,
            address,
        })
    }).then(res => res.json())
        .then(res => resolve(res))
        .catch(err => reject(err))
});

const checkSessionData = (sessionId) => new Promise((resolve, reject) => {
    fetch('https://nox.solanaspaces.com/spaces_nft_list_one/session', {
        headers: {
            'authority': 'nox.solanaspaces.com',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.6',
            'authorization': 'Bearer ' + sessionId,
            'content-type': 'application/json',
            'origin': 'https://drip.haus',
            'referer': 'https://drip.haus/',
            'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Brave";v="114"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-gpc': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        }
    }).then(res => res.json())
        .then(res => resolve(res))
        .catch(err => reject(err))
});

const getAllChannel = (sessionId) => new Promise((resolve, reject) => {
    fetch('https://nox.solanaspaces.com/drip/channels', {
        headers: {
            'authority': 'nox.solanaspaces.com',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.6',
            'authorization': 'Bearer ' + sessionId,
            'content-type': 'application/json',
            'origin': 'https://drip.haus',
            'referer': 'https://drip.haus/',
            'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Brave";v="114"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-gpc': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        }
    }).then(res => res.json())
        .then(res => resolve(res))
        .catch(err => reject(err))
});

const subscribeChannel = (sessionId, slug) => new Promise((resolve, reject) => {
    fetch('https://nox.solanaspaces.com/spaces_nft_list_one/subscribe/' + slug, {
        method: 'POST',
        headers: {
            'authority': 'nox.solanaspaces.com',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.6',
            'authorization': 'Bearer ' + sessionId,
            'content-length': '0',
            'content-type': 'application/json',
            'origin': 'https://drip.haus',
            'referer': 'https://drip.haus/',
            'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Brave";v="114"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-gpc': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        }
    }).then(res => res.json())
        .then(res => resolve(res))
        .catch(err => reject(err))
});

const playingGames = (sessionId) => new Promise((resolve, reject) => {
    fetch('https://nox.solanaspaces.com/spaces_nft_list_one/rarity_lockin/play', {
        method: 'POST',
        headers: {
            'authority': 'nox.solanaspaces.com',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.6',
            'authorization': 'Bearer ' + sessionId,
            'content-length': '0',
            'content-type': 'application/json',
            'origin': 'https://drip.haus',
            'referer': 'https://drip.haus/',
            'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Brave";v="114"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-gpc': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        }
    }).then(res => res.json())
        .then(res => resolve(res))
        .catch(err => reject(err))
});

const inputInvitesCode = (sessionId, inviteCode) => new Promise((resolve, reject) => {

    fetch('https://nox.solanaspaces.com/spaces_nft_list_one/invite_code/verify', {
        method: 'POST',
        headers: {
            'authority': 'nox.solanaspaces.com',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.6',
            'authorization': 'Bearer ' + sessionId,
            'content-type': 'application/json',
            'origin': 'https://drip.haus',
            'referer': 'https://drip.haus/',
            'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Brave";v="114"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-gpc': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        },
        body: JSON.stringify({
            'code': inviteCode
        })
    }).then(res => res.json())
        .then(res => resolve(res))
        .catch(err => reject(err))
});


const loginAndCheckinSession = async (publicKeyString, walletKeypair) => {
    let sessionFolder = './sessions/' + publicKeyString;
    let sessionData = [];
    let sessionDataResult;

    console.log(chalk.cyan(`Check existing session for account ${publicKeyString}`));

    if (fs.existsSync(sessionFolder)) {
        console.log(chalk.yellow(`Existing Session Found, checking...`));
        const files = fs.readdirSync(sessionFolder);
        files.forEach(file => {
            sessionData.push(file)
        });

        if (sessionData.length > 0) {
            sessionDataResult = await checkSessionData(sessionData[0]);
            if (sessionDataResult.error) {
                console.log(chalk.red(`Session expired.`));
                sessionData = []
                files.forEach(file => {
                    fs.unlinkSync(sessionFolder + `/${file}`);
                });
            } else {
                console.log(chalk.green(`Succesfully login existing session!`));
            }
        }
    }

    if (sessionData.length < 1) {
        console.log(chalk.yellow(`Try logging into the account : ${publicKeyString}`));
        const sessionResult = await getSession();
        if (sessionResult.bearer) {
            console.log(chalk.green(`Session ID : ${sessionResult.bearer}`))
            console.log(chalk.yellow(`Verifying...`))
            const message = new TextEncoder().encode(`Login Challenge: ${sessionResult.bearer}`);
            const signature = nacl.sign.detached(message, walletKeypair.secretKey);
            const verifySignatureResult = await verifyPubkey(
                sessionResult.bearer,
                bs58.encode(signature),
                publicKeyString
            );

            if (verifySignatureResult.ok === true) {
                const sessionDataResultLogin = await checkSessionData(sessionResult.bearer);

                if (!fs.existsSync(sessionFolder)) {
                    fs.mkdirSync(sessionFolder);
                }

                fs.writeFileSync(sessionFolder + `/${sessionResult.bearer}`, '');
                console.log(chalk.green(`Successfully Login!`))
                sessionDataResult = sessionDataResultLogin;
            }
        }
    }

    return {
        sessionDataResult
    }

}


(async () => {

    console.log(`
    
        Drip.Haus Bot!
        Auto Claim
        Auto Register If Have Invite Code
        Auto Play Lock-in
        Auto Subscribe To Channel Not Subscribed 
    `)
    console.log('')


    cron.schedule('00 7 * * *', async () => {
        if (!fs.existsSync('./sessions')) {
            fs.mkdirSync('./sessions')
        }


        if (!fs.existsSync('./privatekey.txt')) {
            console.log(chalk.red('File privatekey.txt tidak ditemukan!'));
            process.exit(0);
        }

        const privateKeyList = fs.readFileSync('./privatekey.txt', 'utf-8').split('\n');
        if (privateKeyList.length < 1) {
            console.log(chalk.red('privateKey tidak boleh kosong!'));
            process.exit(0);
        }

        console.log('')
        for (let index = 0; index < privateKeyList.length; index++) {
            const privateKey = privateKeyList[index];
            if (privateKey) {
                const uint8ArraySecretKey = bs58.decode(privateKey);
                const walletKeypair = Keypair.fromSecretKey(uint8ArraySecretKey);

                // const privateKeyBs58 = bs58.encode(walleyKeypair.secretKey);
                const publicKeyString = walletKeypair.publicKey.toBase58();


                try {

                    const {
                        sessionDataResult
                    } = await loginAndCheckinSession(publicKeyString, walletKeypair);


                    console.log(chalk.yellow('Try playing a game....'));
                    console.log(chalk.green(`Current rarity : ${sessionDataResult.rarity_lockin.current_lockin_rarity}`))
                    const datePlayDrop = moment.utc(sessionDataResult.rarity_lockin.next_try_at_ms).toDate();
                    const dateNow = moment().toDate();
                    const remainingTime = moment.duration(datePlayDrop - dateNow);
                    const hours = Math.floor(remainingTime.asHours());
                    const minutes = remainingTime.minutes();
                    const seconds = remainingTime.seconds();
                    if (datePlayDrop <= dateNow) {
                        console.log(chalk.green('Playing....'));
                        const playingGamesReesult = await playingGames(sessionDataResult.bearer);
                        if (playingGamesReesult.error) {
                            console.log(chalk.red('Failed To Play!'));
                        } else {
                            console.log(chalk.green('Success To Play!'));
                            console.log(chalk.green(`Rarity : ${playingGamesReesult.rarity}`));
                        }

                    } else {
                        console.log(chalk.yellow(`You can try again in : ${hours}:${minutes}:${seconds}`))

                    }



                    console.log(chalk.yellow(`checking channel....`));
                    const channelResult = await getAllChannel(sessionDataResult.bearer);
                    let channelNotSubscribed = [];
                    await Promise.all(channelResult.results.map(channelData => {
                        const filterDataChannel = sessionDataResult.subscribed_channels.filter(x => x === channelData.slug);
                        if (filterDataChannel.length === 0) {
                            channelNotSubscribed.push(channelData.slug)
                        }
                    }));


                    if (channelNotSubscribed.length === 0) {
                        console.log(chalk.green(`all channel has been subscribed!`));
                    } else {
                        console.log(chalk.green(`Process subscribing this channel ${channelNotSubscribed.join(',')}`));
                        await Promise.all(channelNotSubscribed.map(async channelSlug => {
                            const subscribeResult = await subscribeChannel(sessionDataResult.bearer, channelSlug);
                            if (!subscribeResult.error) {
                                console.log(`${channelSlug} : `, chalk.green('Success'));
                            } else {
                                console.log(`${channelSlug} : `, chalk.red('Failed'));
                            }
                        }))
                    }

                    console.log(chalk.yellow(`checking invite code....`));
                    if (sessionDataResult.invite_codes.length > 0) {
                        console.log(chalk.green(`Account have an invite code : ${sessionDataResult.invite_codes.length}`));
                        console.log(chalk.green(`Creating new account with the invite code!`));
                        console.log('')
                        await Promise.all(sessionDataResult.invite_codes.map(async inviteCode => {
                            const {
                                walletKeypair,
                                privateKeyBs58,
                                publicKeyString
                            } = createAccountSolana();


                            console.log(chalk.yellow(`Creating new account : ${publicKeyString}`));
                            const {
                                sessionDataResult
                            } = await loginAndCheckinSession(publicKeyString, walletKeypair);

                            if (sessionDataResult.bearer) {
                                console.log(chalk.green('Success Creating and Logining new account!'));
                                console.log(chalk.yellow('input invite code to account!'));
                                fs.appendFileSync('./privatekey.txt', `${privateKeyBs58}\n`);
                                const inputInviteCodeResult = await inputInvitesCode(sessionDataResult.bearer, inviteCode);
                                if (inputInviteCodeResult.ok) {
                                    console.log(chalk.green('Success input invite code!'));
                                } else {
                                    console.log(chalk.red('Success input invite code!'));
                                }
                            } else {
                                console.log(chalk.red('Failed Creating and Logining new account!'));
                            }

                        }));
                    } else {
                        console.log(chalk.grey('Not have invite code!'));
                    }

                } catch (error) {
                    console.log(chalk.red(`ada masalah ketika check session account ${publicKeyString}`));
                }
            }

            console.log('')
            console.log('===========================================')
            console.log('')
        }

    }, {
        scheduled: true,
        timezone: "Asia/Jakarta"
    });




})();