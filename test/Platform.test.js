/* eslint-disable jest/no-conditional-expect */
/* eslint-disable jest/valid-expect */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const { expect } = require('chai');
const Platform = artifacts.require('Platform');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Platform', ([creator, user1, user2]) => {
    let platform;

    beforeEach(async () => {
        platform = await Platform.deployed();
    });

    describe('deployment', () => {
        it('deploys successfully', async () => {
            const address = await platform.address;
            expect(address).to.not.be.undefined;
        });
    });

    describe('addCreator()', () => {
        describe('and user is not already a creator', () => {
            let result;

            it('creates a new creator', async () => {
                result = await platform.addCreator('Kiara', '0x000', 1000, { from: creator });

                const event = result.logs[0].args;

                expect(event.creator).to.equal(creator);
                expect(event.name).to.equal('Kiara');
                expect(event.fee.toNumber()).to.equal(1000);
            });

            it('updates the creators list', async () => {
                result = await platform.getCreators();

                expect(result[0][0]).to.equal(creator);
                expect(result[1].toNumber()).to.equal(1);
            });
        });

        describe('and user is already a creator', () => {
            it('throws an error', async () => {
                // expect(
                //     await platform.addCreator('Kiara', 1000, { from: creator })
                // ).to.throw();

                try {
                    await platform.addCreator('Kiara', '0x000', 1000, { from: creator });
                    expect(1).to.equal(2);
                } catch (error) {
                    expect(error.reason).to.equal('You are already a creator');
                }
            });
        });
    });

    describe('createPost()', () => {
        describe('and user is a creator', () => {
            let result;

            it('creates a new post', async () => {
                result = await platform.createPost('0x12345', 'New post', { from: creator });

                const event = result.logs[0].args;

                expect(event.title).to.equal('New post');
                expect(event.creator).to.equal(creator);
            });

            it('updates the posts list', async () => {
                result = await platform.getPosts();

                expect(result[0][0]).to.equal('New post');
                expect(result[1].toNumber()).to.equal(1);
            });

            it('updates creator details', async () => {
                result = await platform.creators(0);
                
                expect(result.postCount.toNumber()).to.equal(1);
                expect((await platform.creatorToPostIds(creator, 0)).toNumber()).to.equal(0);
            });
        });

        describe('and user is not a creator', () => {
            it('throws an error', async () => {
                try {
                    await platform.createPost('0x12345', 'New post', { from: user1 });
                    expect(1).to.equal(2);
                } catch (error) {
                    expect(error.reason).to.equal('You are not a creator');
                }
            });
        });
    });

    describe('followCreator()', () => {
        describe('and user is not an existing follower', () => {
            let result;

            it('user starts following creator', async () => {
                result = await platform.followCreator(creator, { from: user1 });

                const event = result.logs[0].args;

                expect(event.user).to.equal(user1);
                expect(event.creator).to.equal(creator);
                
                expect(await platform.isFollower(user1, creator)).to.be.true;
            });

            it('updates the creator details', async () => {
                result = await platform.creators(0);

                expect(result.followerCount.toNumber()).to.equal(1);
            });

            // describe('and user sends invalid fee', () => {
            //     it('throws an error', async () => {
            //         try {
            //             await platform.followCreator(creator, { from: user2, value: '200' });
            //             expect(1).to.equal(2);
            //         } catch (error) {
            //             expect(error.reason).to.equal('Pay correct fee to follow creator');
            //         }
            //     });
            // });
        });

        describe('and user is an existing follower', () => {
            it('throws an error', async () => {
                try {
                    await platform.followCreator(creator, { from: user1 });
                    expect(1).to.equal(2);
                } catch (error) {
                    expect(error.reason).to.equal('You are already a follower');
                }
            });
        });
    });

    describe('unfollowCreator()', () => {
        describe('and user is an existing follower', () => {
            let result;

            afterEach(async () => {
                await platform.followCreator(creator, { from: user1 });
            });

            it('user stops following creator', async () => {
                result = await platform.unfollowCreator(creator, { from: user1 });

                const event = result.logs[0].args;

                expect(event.user).to.equal(user1);
                expect(event.creator).to.equal(creator);
                
                expect(await platform.isFollower(user1, creator)).to.be.false;
            });

            it('updates the creator details', async () => {
                await platform.unfollowCreator(creator, { from: user1 });

                result = await platform.creators(0);

                expect(result.followerCount.toNumber()).to.equal(0);
            });
        });

        describe('and user is not an existing follower', () => {
            it('throws an error', async () => {
                try {
                    await platform.unfollowCreator(creator, { from: user2 });
                    expect(1).to.equal(2);
                } catch (error) {
                    expect(error.reason).to.equal('You are not a follower');
                }
            });
        });
    });
});
