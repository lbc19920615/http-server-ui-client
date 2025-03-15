import {deepSet} from "../src/frm.js";

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('deepSet', () => {
    test('设置深层对象属性', () => {
        const obj = {};
        deepSet(obj, 'a.b.c', 5);
        assert.deepEqual(obj, { a: { b: { c: 5 } } });
    });

    test('设置数组索引', () => {
        const obj = {};
        deepSet(obj, 'arr[0]', 'test');
        assert.ok(Array.isArray(obj.arr));
        assert.equal(obj.arr[0], 'test');
    });

    test('混合对象和数组', () => {
        const obj = {};
        deepSet(obj, 'list[0].name', 'Alice');
        assert.ok(Array.isArray(obj.list));
        assert.deepEqual(obj.list[0], { name: 'Alice' });
    });

    test('多层数组嵌套', () => {
        const obj = {};
        deepSet(obj, 'matrix[1][2]', 100);
        assert.equal(obj.matrix[1][2], 100);
    });

    test('覆盖已存在的值', () => {
        const obj = { a: { b: { c: 1 } } };
        deepSet(obj, 'a.b.c', 2);
        assert.equal(obj.a.b.c, 2);
    });

    test('多层混合结构', () => {
        const obj = {};
        deepSet(obj, 'x[0].y[1].z', true);
        assert.equal(obj.x[0].y[1].z, true);
    });

    test('路径中的数字键未用方括号', () => {
        const obj = {};
        deepSet(obj, 'a.0', 'test');
        assert.ok(Array.isArray(obj.a));
        assert.equal(obj.a[0], 'test');
    });

    test('方括号和非方括号混合路径', () => {
        const obj = {};
        deepSet(obj, 'a[0].1', 'mixed');
        assert.equal(obj.a[0][1], 'mixed');
    });

    test('非数字数组索引', () => {
        const obj = {};
        deepSet(obj, 'arr[abc]', 'invalid');
        assert.ok(!Array.isArray(obj.arr));
        assert.equal(obj.arr.NaN, 'invalid');
    });

    test('空路径', () => {
        const obj = { existing: 1 };
        deepSet(obj, '', 2);
        assert.equal(obj[''], 2);
        assert.equal(obj.existing, 1);
    });

    test('覆盖原有对象结构', () => {
        const obj = { a: { 0: {} } };
        deepSet(obj, 'a[0].b', 10);
        assert.ok(!Array.isArray(obj.a));
        assert.equal(obj.a[0].b, 10);
    });

    test('多层数组索引', () => {
        const obj = {};
        deepSet(obj, 'arr[1][2][3]', 'deep');
        assert.equal(obj.arr[1][2][3], 'deep');
    });
});