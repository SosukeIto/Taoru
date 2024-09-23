const Imap = require('node-imap');
const { simpleParser } = require('mailparser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const emailAddress = process.env.MAIL_ADDRESS;
const password = process.env.PASSWORD;
const imapAddress = process.env.IMAP_ADDRESS;

async function fetchMail(interaction, mailAddress) {
    const imap = new Imap({
        user: emailAddress,
        password: password,
        host: imapAddress,
        port: 993,
        tls: true
    });
    await interaction.reply({ content: `${mailAddress}`, ephemeral: true });
}
module.exports = {
    fetchMail: fetchMail
}