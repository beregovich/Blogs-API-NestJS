export const emailTemplateService = {
  getEmailConfirmationMessage(confirmationCode: string) {
    return `<a href="https://bloggers-api-beregovich.herokuapp.com/api/auth/registration-confirmation/?code=${confirmationCode}">${confirmationCode}</a>`;
  },
};
