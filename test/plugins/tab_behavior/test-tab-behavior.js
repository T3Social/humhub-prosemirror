/* jshint -W024 */
/* jshint expr:true */

const expect = require('chai').expect;
const {initEditor, type, toHtml, serialize, clickDropdownMenuItem, pressKeyTab, pressKeyShiftTab, clickMenuItem,
    expectMenuItemVisible, pressKeyEnter, insertText
} = require("../../testEditor");

describe("Plugin:tab_behavior", () => {
    it("test tab in paragraph", (done) => {
        const editor = initEditor();
        type('Test', editor);

        editor.focus();
        expect(editor.hasFocus()).to.be.true;

        expect(toHtml()).to.equal('<p>Test</p>');
        expect(serialize()).to.equal('Test');

        pressKeyTab();
        expect(toHtml()).to.equal('<p>Test</p>');
        expect(serialize()).to.equal('Test');
        // expect(editor.hasFocus()).to.be.false;

        pressKeyShiftTab();
        expect(toHtml()).to.equal('<p>Test</p>');
        expect(serialize()).to.equal('Test');
        expect(editor.hasFocus()).to.be.true;

        done();
    });

    it("test tab in bullet list", (done) => {
        const editor = initEditor();
        clickMenuItem('resizeNav');
        expectMenuItemVisible('group');
        clickMenuItem('wrapBulletList');

        insertText('first item');
        pressKeyEnter();
        insertText('second item');
        expect(toHtml()).to.equal('<ul data-tight="true"><li><p>first item</p></li><li><p>second item</p></li></ul>');
        expect(serialize()).to.equal('- first item\n- second item');

        pressKeyTab();
        expect(toHtml()).to.equal('<ul data-tight="true"><li><p>first item</p><ul data-tight="true"><li><p>second item</p></li></ul></li></ul>');
        expect(serialize()).to.equal('- first item\n  - second item');

        pressKeyShiftTab();
        expect(toHtml()).to.equal('<ul data-tight="true"><li><p>first item</p></li><li><p>second item</p></li></ul>');
        expect(serialize()).to.equal('- first item\n- second item');

        done();
    });

    it("test tab in ordered list", (done) => {
        const editor = initEditor();
        clickMenuItem('resizeNav');
        expectMenuItemVisible('group');
        clickMenuItem('wrapOrderedList');

        insertText('first item');
        pressKeyEnter();
        insertText('second item');
        expect(toHtml()).to.equal('<ol data-tight="true"><li><p>first item</p></li><li><p>second item</p></li></ol>');
        expect(serialize()).to.equal('1. first item\n2. second item');

        pressKeyTab();
        expect(toHtml()).to.equal('<ol data-tight="true"><li><p>first item</p><ol data-tight="true"><li><p>second item</p></li></ol></li></ol>');
        expect(serialize()).to.equal('1. first item\n   1. second item');

        pressKeyShiftTab();
        expect(toHtml()).to.equal('<ol data-tight="true"><li><p>first item</p></li><li><p>second item</p></li></ol>');
        expect(serialize()).to.equal('1. first item\n2. second item');

        done();
    });

    it("test tab in table", (done) => {
        const editor = initEditor();
        clickMenuItem('resizeNav');
        expectMenuItemVisible('insertTable');
        clickMenuItem('insertTable');

        // Checking create table
        const formInputs = $('.ProseMirror-prompt input');
        $(formInputs[0]).val(2);
        $(formInputs[1]).val(2);
        $('.ProseMirror-prompt-submit').click();

        // Checking init cursor position and table rows
        let $from = editor.view.state.selection.$from;
        let depth = $from.depth;
        let table = $from.node(depth - 3);

        expect($from.index(depth - 3)).to.equal(0);
        expect($from.index(depth - 2)).to.equal(0);
        expect(table.childCount).to.equal(2);
        expect(toHtml()).to.equal('<table><tbody><tr><th><p><br class="ProseMirror-trailingBreak"></p></th><th><p><br class="ProseMirror-trailingBreak"></p></th></tr><tr><td><p><br class="ProseMirror-trailingBreak"></p></td><td><p><br class="ProseMirror-trailingBreak"></p></td></tr></tbody></table>');

        // Checking work Tab
        for (let i = 0; i < 4; i++) {
            pressKeyTab();
        }

        // Checking cursor position and table rows after pressing Tab 4 times and creating new row
        $from = editor.view.state.selection.$from;
        depth = $from.depth;
        table = $from.node(depth - 3);

        expect($from.index(depth - 3)).to.equal(2);
        expect($from.index(depth - 2)).to.equal(0);
        expect(table.childCount).to.equal(3);
        expect(toHtml()).to.equal('<table><tbody><tr><th><p><br class="ProseMirror-trailingBreak"></p></th><th><p><br class="ProseMirror-trailingBreak"></p></th></tr><tr><td><p><br class="ProseMirror-trailingBreak"></p></td><td><p><br class="ProseMirror-trailingBreak"></p></td></tr><tr><td><p><br class="ProseMirror-trailingBreak"></p></td><td><p><br class="ProseMirror-trailingBreak"></p></td></tr></tbody></table>');

        // Checking work Shift+Tab
        pressKeyShiftTab();

        $from = editor.view.state.selection.$from;
        depth = $from.depth;

        // Checking cursor position and table rows after pressing Shift+Tab
        expect(toHtml()).to.equal('<table><tbody><tr><th><p><br class="ProseMirror-trailingBreak"></p></th><th><p><br class="ProseMirror-trailingBreak"></p></th></tr><tr><td><p><br class="ProseMirror-trailingBreak"></p></td><td><p><br class="ProseMirror-trailingBreak"></p></td></tr><tr><td><p><br class="ProseMirror-trailingBreak"></p></td><td><p><br class="ProseMirror-trailingBreak"></p></td></tr></tbody></table>');
        expect($from.index(depth - 3)).to.equal(1);
        expect($from.index(depth - 2)).to.equal(1);

        done();
    });

    it("test tab in code block", (done) => {
        const editor = initEditor();
        type('This is a code block');
        clickDropdownMenuItem('type','makeCodeBlock');
        expect(toHtml()).to.equal('<pre><code>This is a code block</code></pre>');
        expect(serialize()).to.equal('```\nThis is a code block\n```');
        pressKeyTab();
        expect(toHtml()).to.equal('<pre><code>	This is a code block</code></pre>');
        expect(serialize()).to.equal('```\n\tThis is a code block\n```');
        pressKeyShiftTab();
        expect(toHtml()).to.equal('<pre><code>This is a code block</code></pre>');
        expect(serialize()).to.equal('```\nThis is a code block\n```');
        done();
    });
});
