import React from 'react';
import waitForExpect from 'wait-for-expect';
import TestRenderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from 'react-apollo/test-utils';

import navigationMenuQuery from '../../../queries/getNavigationMenu.graphql';
import CategoryTree from '../categoryTree';
import Branch from '../categoryBranch';
import Leaf from '../categoryLeaf';

jest.mock('../categoryBranch');
jest.mock('../categoryLeaf');

const mocks = [
    {
        request: {
            query: navigationMenuQuery,
            variables: {
                id: 1
            }
        },
        result: {
            data: {
                category: {
                    id: 1,
                    name: 'Parent Category',
                    product_count: 0,
                    path: '1',
                    children: [
                        {
                            id: 2,
                            name: 'Child Category 1',
                            position: 1,
                            level: 1,
                            url_key: 'child-1',
                            url_path: 'test-category/child-1',
                            product_count: 5,
                            children_count: '2',
                            path: '1/2'
                        },
                        {
                            id: 3,
                            name: 'Child Category 2',
                            position: 2,
                            level: 1,
                            url_key: 'child-2',
                            url_path: 'test-category/child-2',
                            product_count: 3,
                            children_count: '1',
                            path: '1/3'
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: navigationMenuQuery,
            variables: {
                id: 2
            }
        },
        result: {
            data: {
                category: {
                    id: 2,
                    name: 'Child Category 1',
                    product_count: '5',
                    path: '1/2',
                    children: [
                        {
                            id: 4,
                            name: 'Child Leaf 1',
                            position: 1,
                            level: 2,
                            url_key: 'leaf-1',
                            url_path: 'test-category/child-1/leaf-1',
                            product_count: 4,
                            children_count: '0',
                            path: '1/2/4'
                        },
                        {
                            id: 5,
                            name: 'Child Leaf 2',
                            position: 2,
                            level: 2,
                            url_key: 'leaf-2',
                            url_path: 'test-category/child-1/leaf-2',
                            product_count: 2,
                            children_count: '0',
                            path: '1/2/5'
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: navigationMenuQuery,
            variables: {
                id: 3
            }
        },
        result: {
            data: {
                category: {
                    id: 3,
                    name: 'Child Category 2',
                    product_count: 3,
                    path: '1/3',
                    children: [
                        {
                            id: 6,
                            name: 'Child Leaf 3',
                            position: 1,
                            level: 2,
                            url_key: 'leaf-2',
                            url_path: 'test-category/child-2/leaf-3',
                            product_count: 6,
                            children_count: '0',
                            path: '1/3/6'
                        }
                    ]
                }
            }
        }
    }
];

const classes = {
    root: 'a',
    inactive: 'b'
};

test('renders with product data', async () => {
    const rootNodeId = 1;
    const currentId = 1;
    const updateRootNodeId = jest.fn();

    const { root } = TestRenderer.create(
        <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter>
                <CategoryTree
                    rootNodeId={rootNodeId}
                    currentId={currentId}
                    updateRootNodeId={updateRootNodeId}
                    classes={classes}
                />
            </MemoryRouter>
        </MockedProvider>
    );

    await waitForExpect(() => {
        expect(root.findAllByType(Branch).length).toBe(2);
        expect(root.findAllByType(Leaf).length).toBe(3);
    });
});

test('child node correctly sets new root and parent ids', async () => {
    const rootNodeId = 1;
    const currentId = 1;
    const setCurrentPath = jest.fn();

    const { root } = TestRenderer.create(
        <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter>
                <CategoryTree
                    rootNodeId={rootNodeId}
                    currentId={currentId}
                    updateRootNodeId={setCurrentPath}
                    classes={classes}
                />
            </MemoryRouter>
        </MockedProvider>
    );

    await waitForExpect(() => {
        const child = root.findByProps({ path: '1/3' });
        const { onDive, path } = child.props;

        onDive(path);

        expect(setCurrentPath).toHaveBeenLastCalledWith(path);
    });
});
