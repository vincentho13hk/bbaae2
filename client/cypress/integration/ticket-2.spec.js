/// <reference types="cypress" />

const shelly = {
  username: "Shelly",
  email: "shelly@example.com",
  password: "Z6#6%xfLTarZ9U",
};
const colt = {
  username: "Colt",
  email: "colt@example.com",
  password: "L%e$xZHC4QKP@F",
};
const nita = {
  username: "Nita",
  email: "nita@example.com",
  password: "X.49esbrYAB.ahu",
};

describe("New Feature: Unread Messages", () => {
  it("setup", () => {
    cy.signup(shelly.username, shelly.email, shelly.password);
    cy.logout();
    cy.signup(colt.username, colt.email, colt.password);
    cy.logout();
  });

  it("check unread messages count appear", () => {
    cy.login(shelly.username, shelly.password);

    cy.get("input[name=search]").type(colt.username);
    cy.contains(colt.username).click();

    cy.get("input[name=text]").type("First message{enter}");
    cy.get("input[name=text]").type("Second message{enter}");
    cy.get("input[name=text]").type("Third message{enter}");

    cy.logout();
    cy.reload();
    cy.login(colt.username, colt.password);

    cy.get("input[name=search]").type(shelly.username);

    cy.contains(new RegExp("^3$", "g")).should(
      "have.css",
      "background-color",
      "rgb(63, 146, 255)"
    );
    cy.contains("Third message").should(($labels) => {
      expect($labels).to.have.css("font-weight", "600");
      expect($labels).to.have.css("color", "rgb(0, 0, 0)");
    });
  });

  it("press the sidebar user area will read the messages", () => {
    cy.logout();
    cy.reload();

    cy.login(colt.username, colt.password);
    cy.get("input[name=search]").type(shelly.username);
    cy.contains(shelly.username).click();

    cy.contains(new RegExp("^3$", "g")).should("not.exist");
    cy.contains("Third message")
      .first()
      .should("have.css", "font-weight", "400")
      .should("have.css", "color", "rgb(156, 173, 200)");
    // });
  });

  it("self message should not be identified as unread", () => {
    cy.logout();
    cy.reload();
    cy.login(colt.username, colt.password);

    cy.get("input[name=search]").type(shelly.username);
    cy.contains(shelly.username).click();
    cy.get("input[name=text]").type(`Test message{enter}`);

    cy.contains(new RegExp("^1$", "g")).should("not.exist");
    cy.contains("Test message")
      .first()
      .should("have.css", "font-weight", "400")
      .should("have.css", "color", "rgb(156, 173, 200)");

    // clear the unread messages for next test
    cy.logout();
    cy.login(shelly.username, shelly.password);
    cy.get("input[name=search]").type(colt.username);
    cy.contains("Test message").should(($labels) => {
      expect($labels).to.have.css("font-weight", "600");
      expect($labels).to.have.css("color", "rgb(0, 0, 0)");
    });
    cy.contains(colt.username).click();
  });
});
