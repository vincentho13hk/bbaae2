/// <reference types="cypress" />

const alice = {
  username: "Alice2",
  email: "alice2@example.com",
  password: "Z6#6%xfLTarZ9U",
};
const bob = {
  username: "Bob2",
  email: "bob2@example.com",
  password: "L%e$xZHC4QKP@F",
};

describe("New Feature: Unread Messages", () => {
  it("setup", () => {
    cy.signup(alice.username, alice.email, alice.password);
    cy.logout();
    cy.signup(bob.username, bob.email, bob.password);
    cy.logout();
  });

  it("check unread messages count appear", () => {
    cy.login(alice.username, alice.password);

    cy.get("input[name=search]").type(bob.username);
    cy.contains(bob.username).click();

    cy.get("input[name=text]").type("First message{enter}");
    cy.get("input[name=text]").type("Second message{enter}");
    cy.get("input[name=text]").type("Third message{enter}");

    cy.logout();
    cy.reload();
    cy.login(bob.username, bob.password);

    cy.get("input[name=search]").type(alice.username);

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

    cy.login(bob.username, bob.password);
    cy.get("input[name=search]").type(alice.username);
    cy.contains(alice.username).click();

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
    cy.login(bob.username, bob.password);

    cy.get("input[name=search]").type(alice.username);
    cy.contains(alice.username).click();
    cy.get("input[name=text]").type(`Test message{enter}`);

    cy.contains(new RegExp("^1$", "g")).should("not.exist");
    cy.contains("Test message")
      .first()
      .should("have.css", "font-weight", "400")
      .should("have.css", "color", "rgb(156, 173, 200)");

    // clear the unread messages for next test
    cy.logout();
    cy.login(alice.username, alice.password);
    cy.get("input[name=search]").type(bob.username);
    cy.contains("Test message").should(($labels) => {
      expect($labels).to.have.css("font-weight", "600");
      expect($labels).to.have.css("color", "rgb(0, 0, 0)");
    });
    cy.contains(bob.username).click();
  });

  it("too many unread messages", () => {
    cy.logout();
    cy.reload();
    cy.login(bob.username, bob.password);
    cy.get("input[name=search]").type(alice.username);
    cy.contains(alice.username).click();
    const total = 20;
    for (let i = 1; i <= total; i++) {
      cy.get("input[name=text]").type(`message #${i}{enter}`);
    }

    cy.logout();
    cy.login(alice.username, alice.password);

    cy.get("input[name=search]").type(bob.username);
    cy.contains(`message #${total}`)
      .first()
      .should("have.css", "font-weight", "600")
      .should("have.css", "color", "rgb(0, 0, 0)");

    cy.contains("9+");
    // Should not contain the total when too much messages received
    cy.contains(new RegExp("^" + total + "$", "g")).should("not.exist");
    // });
  });
});
